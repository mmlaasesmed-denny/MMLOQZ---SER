import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDb, all, get, run, getSettings, saveSettings, logMessage } from './db.js';
import { runFullScrape, syncSponsorList, sendEmailAlert } from './scraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();
// Also load from parent folder for workspace integration (e.g. GEMINI_API_KEY)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(express.json());

// Serve static dashboard files
app.use(express.static(path.join(__dirname, 'public')));

// Uptime tracker
const startTime = new Date();

// 1. Dashboard Metrics Endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const settings = await getSettings();
    
    const jobsCount = await get(`SELECT COUNT(*) as cnt FROM jobs`);
    const sponsoredCount = await get(`SELECT COUNT(*) as cnt FROM jobs WHERE is_sponsored = 1`);
    const sponsorsCount = await get(`SELECT COUNT(*) as cnt FROM sponsors`);
    
    res.json({
      uptime_seconds: Math.floor((new Date() - startTime) / 1000),
      total_jobs_scanned: jobsCount.cnt,
      total_sponsors: sponsorsCount.cnt,
      total_sponsored_matches: sponsoredCount.cnt,
      last_scraper_run: settings.last_scraper_run || 'Never',
      last_scraper_status: settings.last_scraper_status || 'idle',
      last_sponsor_sync: settings.last_sponsor_sync || 'Never',
      email_configured: !!settings.email_recipient,
      smtp_configured: !!(settings.smtp_host && settings.smtp_user),
      is_scraper_enabled: settings.is_scraper_enabled === '1'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Jobs Endpoint
app.get('/api/jobs', async (req, res) => {
  try {
    const onlySponsored = req.query.only_sponsored === 'true';
    let query = `SELECT * FROM jobs`;
    const params = [];
    
    if (onlySponsored) {
      query += ` WHERE is_sponsored = 1`;
    }
    
    query += ` ORDER BY date_found DESC LIMIT 200`;
    
    const jobs = await all(query, params);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Search Sponsors Endpoint
app.get('/api/sponsors', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query || query.length < 2) {
      const count = await get(`SELECT COUNT(*) as cnt FROM sponsors`);
      return res.json({ total: count.cnt, results: [] });
    }
    
    const results = await all(
      `SELECT * FROM sponsors WHERE name LIKE ? OR town LIKE ? LIMIT 50`,
      [`%${query}%`, `%${query}%`]
    );
    res.json({ total: results.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Logs Endpoint
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await all(`SELECT * FROM logs ORDER BY id DESC LIMIT 100`);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Settings Endpoint
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    // Do not return raw SMTP password in plain text if requested, hide it for UI safety
    const safeSettings = { ...settings };
    if (safeSettings.smtp_pass) {
      safeSettings.smtp_pass_set = true;
      delete safeSettings.smtp_pass;
    } else {
      safeSettings.smtp_pass_set = false;
    }
    res.json(safeSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Save Settings Endpoint
app.post('/api/settings', async (req, res) => {
  try {
    const newSettings = req.body;
    
    // If password was not sent but was set previously, retain it
    if (newSettings.smtp_pass === undefined || newSettings.smtp_pass === '') {
      delete newSettings.smtp_pass; // Don't overwrite with empty
    }
    
    if (newSettings.search_keywords) {
      // Validate it is an array
      try {
        const parsed = JSON.parse(newSettings.search_keywords);
        if (!Array.isArray(parsed)) throw new Error();
      } catch (_) {
        return res.status(400).json({ error: 'search_keywords must be a valid JSON array string' });
      }
    }
    
    await saveSettings(newSettings);
    await logMessage('INFO', 'User updated application settings.');
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Trigger Manual Job Scrape
app.post('/api/trigger-scrape', async (req, res) => {
  // Fire and forget so page doesn't hang
  runFullScrape().catch(err => console.error('Background scrape failed:', err));
  res.json({ success: true, message: 'Job scraper triggered in background.' });
});

// 8. Trigger Sponsor List Sync
app.post('/api/sync-sponsors', async (req, res) => {
  // Fire and forget
  syncSponsorList().catch(err => console.error('Background sponsor sync failed:', err));
  res.json({ success: true, message: 'Sponsor list download triggered in background.' });
});

// 9. Test Email Alert
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }
    
    const settings = await getSettings();
    
    const mockJobs = [
      {
        title: 'SAP GRC Security Consultant (Test Alert)',
        company: 'Accenture (Example Match)',
        location: 'London',
        salary: '£65,000 - £80,000',
        description: 'This is a test notification from your newly configured SAP GRC visa tracker. It confirms that the SMTP credentials are correct and email sending is active.',
        url: 'https://www.google.com',
        sponsor_details: JSON.stringify({
          name: 'ACCENTURE (UK) LIMITED',
          town: 'London',
          county: 'Greater London',
          tier_rating: 'Worker (A rating)',
          route: 'Skilled Worker'
        })
      }
    ];
    
    const success = await sendEmailAlert(email, mockJobs, settings);
    if (success) {
      res.json({ success: true, message: `Test email sent to ${email}!` });
    } else {
      res.status(500).json({ error: 'Failed to send email. Check logs for SMTP configuration errors.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express and Scheduler
const PORT = process.env.PORT || 5001;

async function startServer() {
  await initDb();
  await logMessage('INFO', 'Database initialized.');
  
  app.listen(PORT, () => {
    logMessage('INFO', `SAP GRC Job Tracker listening at http://localhost:${PORT}`);
  });
  
  // Background Scheduler Loop (checks settings every 60 seconds)
  setInterval(async () => {
    try {
      const settings = await getSettings();
      if (settings.is_scraper_enabled !== '1') return;
      if (settings.last_scraper_status === 'running') return;
      
      const intervalHours = parseFloat(settings.check_interval_hours) || 12;
      const lastRunStr = settings.last_scraper_run;
      
      let shouldScrape = false;
      if (!lastRunStr || lastRunStr === 'Never') {
        shouldScrape = true;
      } else {
        const lastRun = new Date(lastRunStr);
        const nextRun = new Date(lastRun.getTime() + intervalHours * 60 * 60 * 1000);
        if (new Date() >= nextRun) {
          shouldScrape = true;
        }
      }
      
      if (shouldScrape) {
        await logMessage('INFO', `Scheduler triggered scraper run (Interval: ${intervalHours}h)`);
        runFullScrape().catch(err => console.error('Scheduled scrape failed:', err));
      }
    } catch (err) {
      console.error('Scheduler loop error:', err);
    }
  }, 60 * 1000); // 1 minute ticks
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
