import { get, all, run, logMessage, getSettings } from './db.js';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

// Helper to parse CSV lines with escaped quotes and commas
export function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Scrape GOV.UK for CSV link
export async function getLatestSponsorListUrl() {
  const pageUrl = 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers';
  const res = await fetch(pageUrl);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const html = await res.text();
  
  const match = html.match(/https:\/\/assets\.publishing\.service\.gov\.uk\/[^\s"]+?\.csv/);
  if (match) return match[0];
  
  const fallbackMatch = html.match(/href="([^"]+?\.csv)"/);
  if (fallbackMatch) return fallbackMatch[1];
  
  throw new Error('Could not find CSV URL on GOV.UK page');
}

// Download and sync sponsor list
export async function syncSponsorList() {
  await logMessage('INFO', 'Starting UK Sponsor List Sync...');
  
  try {
    const csvUrl = await getLatestSponsorListUrl();
    await logMessage('INFO', `Found latest sponsor CSV URL: ${csvUrl}`);
    
    const csvRes = await fetch(csvUrl);
    if (!csvRes.ok) throw new Error(`Failed to download CSV: ${csvRes.statusText}`);
    
    const text = await csvRes.text();
    const lines = text.split(/\r?\n/);
    await logMessage('INFO', `Downloaded CSV. Total lines to parse: ${lines.length}`);
    
    let isHeader = true;
    let headers = [];
    let count = 0;
    
    await run('BEGIN TRANSACTION');
    await run('DELETE FROM sponsors');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      const fields = parseCSVLine(line);
      
      if (isHeader) {
        headers = fields.map(h => h.toLowerCase().replace(/^\uFEFF/, '').replace(/['"]/g, '').trim());
        isHeader = false;
        continue;
      }
      
      let name = '';
      let town = '';
      let county = '';
      let tierRating = '';
      let route = '';
      
      for (let i = 0; i < headers.length; i++) {
        const h = headers[i];
        const val = fields[i] || '';
        if (h.includes('organisation') || h.includes('organization') || h.includes('name')) {
          if (!name) name = val;
        } else if (h.includes('town') || h.includes('city')) {
          town = val;
        } else if (h.includes('county')) {
          county = val;
        } else if (h.includes('rating') || h.includes('tier')) {
          if (!tierRating) tierRating = val;
          else tierRating += ` - ${val}`;
        } else if (h.includes('route') || h.includes('sub tier') || h.includes('sub-tier')) {
          route = val;
        }
      }
      
      if (name) {
        await run(
          `INSERT OR IGNORE INTO sponsors (name, town, county, tier_rating, route) VALUES (?, ?, ?, ?, ?)`,
          [name, town, county, tierRating, route]
        );
        count++;
      }
      
      if (count % 20000 === 0 && count > 0) {
        await run('COMMIT');
        await run('BEGIN TRANSACTION');
        await logMessage('INFO', `Imported ${count} sponsors...`);
      }
    }
    
    await run('COMMIT');
    await logMessage('INFO', `Successfully imported ${count} sponsors into SQLite!`);
    
    const now = new Date().toISOString();
    await run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('last_sponsor_sync', ?)`, [now]);
    
    return count;
  } catch (err) {
    try { await run('ROLLBACK'); } catch (_) {}
    await logMessage('ERROR', `Sponsor List Sync failed: ${err.message}`);
    throw err;
  }
}

// Clean and normalize company name for matching
export function cleanCompanyName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|plc|llp|inc|co|corp|uk|group|services|technologies|solutions|consulting|systems|europe|international|holding|holdings)\b/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Query SQLite for matching sponsor
export async function findSponsorMatch(companyName) {
  if (!companyName) return null;
  const cleanJobCompany = cleanCompanyName(companyName);
  if (!cleanJobCompany || cleanJobCompany.length < 2) return null;
  
  // 1. Exact match on raw company name
  let sponsor = await get(`SELECT * FROM sponsors WHERE name = ? COLLATE NOCASE`, [companyName.trim()]);
  if (sponsor) return sponsor;
  
  // 2. Exact match on clean company name
  sponsor = await get(`SELECT * FROM sponsors WHERE name LIKE ? COLLATE NOCASE`, [cleanJobCompany]);
  if (sponsor) return sponsor;
  
  // 3. Substring match
  sponsor = await get(`SELECT * FROM sponsors WHERE name LIKE ? COLLATE NOCASE`, [`%${cleanJobCompany}%`]);
  if (sponsor) {
    const cleanSponsorName = cleanCompanyName(sponsor.name);
    // Protect against matching very short job company names (e.g. "IT") inside longer words
    if (cleanJobCompany.length < 4 && cleanSponsorName !== cleanJobCompany) {
      return null;
    }
    return sponsor;
  }
  
  return null;
}

// Helper to dynamically get search keywords from checked domains
function getSearchKeywords(settings) {
  try {
    const domains = JSON.parse(settings.filter_domains || '[]');
    if (domains.length > 0) return domains;
  } catch (_) {}
  
  try {
    return JSON.parse(settings.search_keywords || '["SAP GRC"]');
  } catch (_) {
    return ['SAP GRC'];
  }
}

// Helper to filter Adzuna/Reed jobs by checked Experience Levels and Job Types
function matchesFilters(job, settings) {
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  // 1. Experience Filter
  try {
    const expFilters = JSON.parse(settings.filter_experience || '[]');
    if (expFilters.length > 0) {
      let matchesExp = false;
      for (const filter of expFilters) {
        if (filter.includes('Junior')) {
          if (titleLower.includes('junior') || titleLower.includes('grad') || titleLower.includes('associate') || descLower.includes('junior') || descLower.includes('entry level')) {
            matchesExp = true;
            break;
          }
        }
        if (filter.includes('Senior') || filter.includes('Lead')) {
          if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('sr.') || descLower.includes('senior ') || descLower.includes(' lead ')) {
            matchesExp = true;
            break;
          }
        }
        if (filter.includes('Manager') || filter.includes('Architect')) {
          if (titleLower.includes('manager') || titleLower.includes('architect') || titleLower.includes('head of') || titleLower.includes('director') || descLower.includes('manager') || descLower.includes('architect')) {
            matchesExp = true;
            break;
          }
        }
        if (filter.includes('Mid-Level')) {
          const isJunior = titleLower.includes('junior') || titleLower.includes('grad') || titleLower.includes('associate');
          const isSenior = titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('sr.') || titleLower.includes('manager') || titleLower.includes('architect') || titleLower.includes('head');
          if (!isJunior && !isSenior) {
            matchesExp = true;
            break;
          }
        }
      }
      if (!matchesExp) return false;
    }
  } catch (_) {}

  // 2. Job Type Filter
  try {
    const typeFilters = JSON.parse(settings.filter_job_types || '[]');
    if (typeFilters.length > 0) {
      const isContract = titleLower.includes('contract') || titleLower.includes('freelance') || titleLower.includes('temp') || descLower.includes('day rate') || descLower.includes('inside ir35') || descLower.includes('outside ir35') || descLower.includes('daily rate');
      
      const hasPerm = typeFilters.some(t => t.includes('Permanent'));
      const hasContract = typeFilters.some(t => t.includes('Contract'));
      
      if (hasPerm && !hasContract && isContract) return false;
      if (hasContract && !hasPerm && !isContract) return false;
    }
  } catch (_) {}

  return true;
}

// Scrape jobs from Adzuna API
async function scrapeAdzuna(settings, keywords) {
  const appId = settings.adzuna_app_id;
  const appKey = settings.adzuna_app_key;
  if (!appId || !appKey) {
    await logMessage('INFO', 'Adzuna API keys not set. Skipping Adzuna scrape.');
    return [];
  }
  
  const jobs = [];
  for (const kw of keywords) {
    await logMessage('INFO', `Querying Adzuna for: "${kw}"`);
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${encodeURIComponent(kw)}`;
      const res = await fetch(url);
      if (!res.ok) {
        await logMessage('WARN', `Adzuna API returned status ${res.status} for keyword "${kw}"`);
        continue;
      }
      const data = await res.json();
      if (data && data.results) {
        for (const item of data.results) {
          const rawJob = {
            id: `adzuna-${item.id}`,
            title: item.title,
            company: item.company ? item.company.display_name : '',
            location: item.location ? item.location.display_name : 'UK',
            description: item.description,
            url: item.redirect_url,
            salary: item.salary_min ? `£${item.salary_min}` : 'N/A',
            date_posted: item.created || new Date().toISOString()
          };
          
          if (matchesFilters(rawJob, settings)) {
            jobs.push(rawJob);
          }
        }
      }
    } catch (err) {
      await logMessage('ERROR', `Adzuna query failed for "${kw}": ${err.message}`);
    }
  }
  return jobs;
}

// Scrape jobs from Reed API
async function scrapeReed(settings, keywords) {
  const apiKey = settings.reed_api_key;
  if (!apiKey) {
    await logMessage('INFO', 'Reed API key not set. Skipping Reed scrape.');
    return [];
  }
  
  const jobs = [];
  const authHeader = `Basic ${Buffer.from(apiKey + ':').toString('base64')}`;
  
  for (const kw of keywords) {
    await logMessage('INFO', `Querying Reed for: "${kw}"`);
    try {
      const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(kw)}&locationName=United%20Kingdom`;
      const res = await fetch(url, {
        headers: { 'Authorization': authHeader }
      });
      if (!res.ok) {
        await logMessage('WARN', `Reed API returned status ${res.status} for keyword "${kw}"`);
        continue;
      }
      const data = await res.json();
      if (data && data.results) {
        for (const item of data.results) {
          const rawJob = {
            id: `reed-${item.jobId}`,
            title: item.jobTitle,
            company: item.employerName,
            location: item.locationName || 'UK',
            description: item.jobDescription,
            url: item.jobUrl,
            salary: item.minimumSalary ? `£${item.minimumSalary}` : 'N/A',
            date_posted: item.date || new Date().toISOString()
          };
          
          if (matchesFilters(rawJob, settings)) {
            jobs.push(rawJob);
          }
        }
      }
    } catch (err) {
      await logMessage('ERROR', `Reed query failed for "${kw}": ${err.message}`);
    }
  }
  return jobs;
}

// Scrape jobs using Gemini Search Grounding
async function scrapeGemini(settings) {
  const apiKey = settings.gemini_api_key || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    await logMessage('INFO', 'Gemini API Key not set. Skipping Gemini search grounding.');
    return [];
  }
  
  const jobs = [];
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const domains = JSON.parse(settings.filter_domains || '[]');
    const expLevels = JSON.parse(settings.filter_experience || '[]');
    const jobTypes = JSON.parse(settings.filter_job_types || '[]');
    
    const domainsStr = domains.length > 0 ? domains.join(', ') : 'SAP GRC Security, SAP Security';
    const expStr = expLevels.length > 0 ? expLevels.join(', ') : 'Any Experience Level';
    const typesStr = jobTypes.length > 0 ? jobTypes.join(', ') : 'Any Job Type';
    
    await logMessage('INFO', `Querying Gemini 3.5 Flash Search Grounding...`);
    await logMessage('INFO', `Filters: Domains=[${domainsStr}], Experience=[${expStr}], Types=[${typesStr}]`);
    
    const prompt = `Search the live web for active job openings in the UK matching the following criteria:
    - SAP Security Domains: must match one or more of: [${domainsStr}].
    - Experience Levels: must match one or more of: [${expStr}].
    - Job Types: must match one or more of: [${typesStr}].
    
    Return the list of matching active job postings as a JSON array. Each object in the array should have:
    - title: the job title
    - company: the hiring company name
    - location: the location (City, UK)
    - description: a short 2-3 sentence summary of requirements
    - url: the direct URL to the job posting or citation link
    - salary: salary details if mentioned (otherwise "N/A")
    - date_posted: date posted (relative or ISO date)
    
    Do not wrap the JSON output in markdown formatting. Return raw JSON string.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              company: { type: 'STRING' },
              location: { type: 'STRING' },
              description: { type: 'STRING' },
              url: { type: 'STRING' },
              salary: { type: 'STRING' },
              date_posted: { type: 'STRING' }
            },
            required: ['title', 'company', 'location', 'url']
          }
        }
      }
    });
    
    const results = JSON.parse(response.text);
    if (results && Array.isArray(results)) {
      for (const item of results) {
        const hash = Buffer.from(item.url + item.title).toString('base64').substring(0, 16);
        jobs.push({
          id: `gemini-${hash}`,
          title: item.title,
          company: item.company,
          location: item.location || 'UK',
          description: item.description || '',
          url: item.url,
          salary: item.salary || 'N/A',
          date_posted: item.date_posted || new Date().toISOString()
        });
      }
    }
  } catch (err) {
    await logMessage('ERROR', `Gemini Search Grounding query failed: ${err.message}`);
  }
  
  return jobs;
}

// Send digest email notification to user
export async function sendEmailAlert(recipient, matchingJobs, smtpConfig) {
  if (!recipient) {
    await logMessage('WARN', 'No recipient email stored. Cannot send email alert.');
    return false;
  }
  if (!smtpConfig.smtp_host || !smtpConfig.smtp_user || !smtpConfig.smtp_pass) {
    await logMessage('WARN', 'SMTP settings incomplete. Cannot send email alert. Please configure in Settings.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.smtp_host,
    port: parseInt(smtpConfig.smtp_port) || 587,
    secure: smtpConfig.smtp_secure === '1',
    auth: {
      user: smtpConfig.smtp_user,
      pass: smtpConfig.smtp_pass
    }
  });

  const jobRows = matchingJobs.map(job => {
    const details = JSON.parse(job.sponsor_details || '{}');
    return `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-weight: bold; color: #1e293b;">${job.title}</td>
        <td style="padding: 12px; color: #334155;">
          <strong>${job.company}</strong><br/>
          <span style="font-size: 12px; color: #64748b;">
            Sponsor: ${details.name || 'Yes'}<br/>
            Rating: ${details.tier_rating || 'N/A'}<br/>
            Route: ${details.route || 'N/A'}<br/>
            Location: ${details.town || job.location}${details.county ? ', ' + details.county : ''}
          </span>
        </td>
        <td style="padding: 12px; color: #334155; font-size: 13px;">${job.salary || 'N/A'}</td>
        <td style="padding: 12px; font-size: 12px; color: #475569;">${job.description ? job.description.substring(0, 150) + '...' : 'No description.'}</td>
        <td style="padding: 12px; text-align: center;">
          <a href="${job.url}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block;">Apply</a>
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #334155; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 20px; border-radius: 6px 6px 0 0; color: #ffffff; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">SAP GRC Sponsorship Alert</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">We found new visa sponsored opportunities in the UK</p>
      </div>
      <div style="padding: 20px;">
        <p style="font-size: 15px;">Hello,</p>
        <p style="font-size: 15px;">Our 24/7 background scanner discovered the following <strong>${matchingJobs.length} new job posting(s)</strong> that match your criteria and are offered by companies registered on the UK Home Office Licensed Sponsor List:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left;">
              <th style="padding: 12px; color: #475569;">Job Title</th>
              <th style="padding: 12px; color: #475569;">Company & Sponsor Info</th>
              <th style="padding: 12px; color: #475569;">Salary</th>
              <th style="padding: 12px; color: #475569;">Description Snippet</th>
              <th style="padding: 12px; text-align: center; color: #475569;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${jobRows}
          </tbody>
        </table>
        
        <p style="margin-top: 30px; font-size: 13px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
          This is an automated notification from your 24/7 SAP GRC UK Job Tracker dashboard.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"SAP GRC Job Tracker" <${smtpConfig.smtp_user}>`,
    to: recipient,
    subject: `[Job Alerts] ${matchingJobs.length} New SAP GRC Sponsored Vacancies in the UK`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    await logMessage('INFO', `Sent email alert digest containing ${matchingJobs.length} jobs to ${recipient}`);
    return true;
  } catch (err) {
    await logMessage('ERROR', `Failed to send email alert: ${err.message}`);
    return false;
  }
}

// Orchestrator: Triggered by Express or Cron
export async function runFullScrape() {
  const settings = await getSettings();
  
  if (settings.last_scraper_status === 'running') {
    await logMessage('WARN', 'Scraper is already running. Skipping trigger.');
    return;
  }
  
  await run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('last_scraper_status', 'running')`);
  await run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('last_scraper_run', ?)`, [new Date().toISOString()]);
  
  await logMessage('INFO', '=== Starting Job Scraping Run ===');
  
  try {
    const keywords = getSearchKeywords(settings);
    let allJobs = [];
    
    // 1. Scrape from enabled sources
    const adzunaJobs = await scrapeAdzuna(settings, keywords);
    allJobs = allJobs.concat(adzunaJobs);
    
    const reedJobs = await scrapeReed(settings, keywords);
    allJobs = allJobs.concat(reedJobs);
    
    const geminiJobs = await scrapeGemini(settings);
    allJobs = allJobs.concat(geminiJobs);
    
    await logMessage('INFO', `Scraped a total of ${allJobs.length} raw jobs across all boards.`);
    
    let matchesFound = [];
    let newJobsCount = 0;
    const onlySponsored = settings.filter_only_sponsored === '1';
    
    // 2. Process and match jobs
    for (const job of allJobs) {
      // Check if job already exists in our database
      const existing = await get(`SELECT id, notified FROM jobs WHERE id = ?`, [job.id]);
      
      if (existing) {
        continue; // Skip already tracked jobs
      }
      
      newJobsCount++;
      // Check if hiring company is on UK Sponsor list
      const sponsorMatch = await findSponsorMatch(job.company);
      const isSponsored = sponsorMatch ? 1 : 0;
      const sponsorDetailsJson = sponsorMatch ? JSON.stringify(sponsorMatch) : '';
      
      // If only sponsored jobs are desired and this job has no sponsor, skip it
      if (onlySponsored && !isSponsored) {
        continue;
      }
      
      // Save job to database
      await run(`
        INSERT INTO jobs (id, title, company, location, description, url, salary, date_posted, is_sponsored, sponsor_details, date_found, notified)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `, [
        job.id,
        job.title,
        job.company,
        job.location,
        job.description,
        job.url,
        job.salary,
        job.date_posted,
        isSponsored,
        sponsorDetailsJson,
        new Date().toISOString()
      ]);
      
      if (isSponsored) {
        // Fetch the inserted job row for emailing
        const inserted = await get(`SELECT * FROM jobs WHERE id = ?`, [job.id]);
        matchesFound.push(inserted);
      }
    }
    
    await logMessage('INFO', `Processed ${newJobsCount} new job postings. Matches found: ${matchesFound.length}`);
    
    // 3. Email Alert if matches found and email is configured
    if (matchesFound.length > 0 && settings.email_recipient) {
      const emailSuccess = await sendEmailAlert(settings.email_recipient, matchesFound, settings);
      if (emailSuccess) {
        // Mark these jobs as notified
        for (const job of matchesFound) {
          await run(`UPDATE jobs SET notified = 1 WHERE id = ?`, [job.id]);
        }
      }
    }
    
    await run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('last_scraper_status', 'success')`);
    await logMessage('INFO', '=== Job Scraping Run Completed Successfully ===');
  } catch (err) {
    await run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('last_scraper_status', 'error')`);
    await logMessage('ERROR', `Job Scraping Run failed: ${err.message}`);
  }
}
