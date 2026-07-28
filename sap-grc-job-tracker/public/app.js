// === FRONTEND ENGINE FOR SAP GRC JOB TRACKER ===

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // State Variables
  let currentTab = 'jobs';
  let logsInterval = null;
  let statsInterval = null;
  let savedEmail = '';
  let loadedJobs = []; // Caches fetched jobs for real-time filter

  // DOM Elements
  const tabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Toggles & Actions
  const btnThemeToggle = document.getElementById('btn-theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const btnDevToggle = document.getElementById('btn-dev-toggle');
  
  const btnRunScrape = document.getElementById('btn-run-scrape');
  const btnSyncSponsors = document.getElementById('btn-sync-sponsors');
  const btnTestEmail = document.getElementById('btn-test-email');
  
  // Forms & Inputs
  const emailForm = document.getElementById('email-setup-form');
  const emailInput = document.getElementById('email-input');
  
  const settingsForm = document.getElementById('settings-form');
  const checkActiveScraper = document.getElementById('check-active-scraper');
  const inputInterval = document.getElementById('input-interval');
  
  // Checkbox grids
  const checkOnlySponsoredAlerts = document.getElementById('check-only-sponsored-alerts');
  
  const smtpForm = document.getElementById('smtp-form');
  const smtpHost = document.getElementById('smtp-host');
  const smtpPort = document.getElementById('smtp-port');
  const smtpSecure = document.getElementById('smtp-secure');
  const smtpUser = document.getElementById('smtp-user');
  const smtpPass = document.getElementById('smtp-pass');
  
  const apiKeysForm = document.getElementById('api-keys-form');
  const adzunaId = document.getElementById('adzuna-id');
  const adzunaKey = document.getElementById('adzuna-key');
  const reedKey = document.getElementById('reed-key');
  const geminiKey = document.getElementById('gemini-key');
  
  const checkOnlySponsored = document.getElementById('check-only-sponsored');
  const sponsorSearchInput = document.getElementById('sponsor-search-input');
  const jobSearchInput = document.getElementById('job-search-input');
  
  // Containers
  const jobsContainer = document.getElementById('jobs-container');
  const sponsorsContainer = document.getElementById('sponsors-container');
  const logsConsoleContainer = document.getElementById('logs-console-container');
  const toastMessage = document.getElementById('toast-message');
  
  // Stats Elements
  const statSponsors = document.getElementById('stat-sponsors');
  const statJobs = document.getElementById('stat-jobs');
  const statEmail = document.getElementById('stat-email');
  const statStatus = document.getElementById('stat-status');
  const scraperPulse = document.getElementById('scraper-pulse');
  const sponsorSyncTime = document.getElementById('sponsor-sync-time');

  // Collapsibles Setup
  setupCollapsible('smtp-header-trigger', 'smtp-content-panel');
  setupCollapsible('api-header-trigger', 'api-content-panel');

  function setupCollapsible(triggerId, contentId) {
    const trigger = document.getElementById(triggerId);
    const content = document.getElementById(contentId);
    if (!trigger || !content) return;
    trigger.addEventListener('click', () => {
      trigger.classList.toggle('active');
      content.classList.toggle('collapsed');
    });
  }

  // Toast Helper
  function showToast(message, type = 'success') {
    const icon = toastMessage.querySelector('.toast-icon');
    const text = toastMessage.querySelector('.toast-text');
    text.textContent = message;
    
    icon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'alert-circle');
    icon.className = `toast-icon ${type === 'success' ? 'text-emerald' : 'text-crimson'}`;
    lucide.createIcons();
    
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3500);
  }

  // --- THEME & DEVELOPER MODE TOGGLES ---

  // Initialize Theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.setAttribute('data-lucide', 'moon');
    lucide.createIcons();
  }

  btnThemeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    lucide.createIcons();
    showToast(`${isLight ? 'Light' : 'Dark'} Mode activated!`);
  });

  // Developer mode toggle (controls .user-mode class on body)
  btnDevToggle.addEventListener('click', () => {
    const isUserMode = document.body.classList.contains('user-mode');
    
    if (isUserMode) {
      // Toggle Dev mode ON
      document.body.classList.remove('user-mode');
      btnDevToggle.style.background = 'rgba(99, 102, 241, 0.15)';
      btnDevToggle.style.borderColor = 'var(--accent-indigo)';
      btnDevToggle.style.color = 'var(--accent-indigo)';
      showToast('Developer Configuration & Logs unlocked!');
    } else {
      // Toggle Dev mode OFF
      document.body.classList.add('user-mode');
      btnDevToggle.style.background = '';
      btnDevToggle.style.borderColor = '';
      btnDevToggle.style.color = '';
      showToast('Developer Mode disabled.');
      
      // If we are currently viewing the Logs tab, force switch back to Jobs Feed
      if (currentTab === 'logs') {
        switchTab('jobs');
      }
    }
  });

  function switchTab(tabId) {
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (targetTabBtn) targetTabBtn.classList.add('active');
    
    currentTab = tabId;
    const targetContent = document.getElementById(`tab-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
    
    if (currentTab === 'logs') {
      fetchLogs();
      clearInterval(logsInterval);
      logsInterval = setInterval(fetchLogs, 3000);
    } else {
      clearInterval(logsInterval);
    }
    
    if (currentTab === 'jobs') {
      fetchJobs();
    }
  }

  // --- API OPERATIONS ---

  // 1. Fetch Dashboard Stats
  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to load metrics');
      const data = await res.json();
      
      statSponsors.textContent = Number(data.total_sponsors).toLocaleString();
      statJobs.textContent = data.total_jobs_scanned;
      statEmail.textContent = data.email_configured ? 'Active' : 'Not Configured';
      statEmail.className = data.email_configured ? 'badge-value text-emerald' : 'badge-value text-slate';
      
      // Update Pulse Dot Class
      scraperPulse.className = 'pulse-indicator';
      if (data.last_scraper_status === 'running') {
        scraperPulse.classList.add('running');
        statStatus.textContent = 'Scanning...';
        statStatus.className = 'badge-value text-indigo';
        btnRunScrape.disabled = true;
        btnRunScrape.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px;margin:0"></div> Scrape Running';
      } else if (data.last_scraper_status === 'error') {
        scraperPulse.classList.add('error');
        statStatus.textContent = 'Error';
        statStatus.className = 'badge-value text-crimson';
        btnRunScrape.disabled = false;
        btnRunScrape.innerHTML = '<i data-lucide="play"></i> Scan for Jobs Now';
      } else {
        scraperPulse.classList.add('active');
        statStatus.textContent = 'Uptime: ' + formatUptime(data.uptime_seconds);
        statStatus.className = 'badge-value text-emerald';
        btnRunScrape.disabled = false;
        btnRunScrape.innerHTML = '<i data-lucide="play"></i> Scan for Jobs Now';
      }
      lucide.createIcons();
      
      if (data.last_sponsor_sync && data.last_sponsor_sync !== 'Never') {
        const date = new Date(data.last_sponsor_sync);
        sponsorSyncTime.textContent = `Last sync: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      } else {
        sponsorSyncTime.textContent = 'Last sync: Never';
      }
    } catch (err) {
      console.error(err);
    }
  }

  function formatUptime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  // Render jobs on grid
  function renderJobs(jobs) {
    jobsContainer.innerHTML = '';
    if (jobs.length === 0) {
      jobsContainer.innerHTML = `
        <div class="empty-state">
          <i data-lucide="inbox"></i>
          <p>No job postings found matching your query.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }
    
    jobs.forEach(job => {
      const date = new Date(job.date_found);
      const relativeTime = formatRelativeTime(date);
      
      let sponsorSectionHtml = '';
      if (job.is_sponsored === 1 && job.sponsor_details) {
        const sp = JSON.parse(job.sponsor_details);
        sponsorSectionHtml = `
          <div class="sponsor-details-card">
            <div class="sponsor-details-row">
              <span><strong>Sponsor:</strong> ${sp.name}</span>
              <span><strong>Rating:</strong> ${sp.tier_rating}</span>
            </div>
            <div class="sponsor-details-row" style="margin-top: 4px;">
              <span><strong>Route:</strong> ${sp.route}</span>
              <span><strong>Location:</strong> ${sp.town || job.location}${sp.county ? ', ' + sp.county : ''}</span>
            </div>
          </div>
        `;
      }
      
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <div class="job-info">
          ${job.is_sponsored === 1 ? `<div class="sponsored-badge"><i data-lucide="shield-check"></i> Verified Sponsor</div>` : ''}
          <h3 class="job-title">${job.title}</h3>
          <div class="job-metadata">
            <div class="metadata-item">
              <i data-lucide="building"></i>
              <span>${job.company}</span>
            </div>
            <div class="metadata-item">
              <i data-lucide="map-pin"></i>
              <span>${job.location}</span>
            </div>
            <div class="metadata-item">
              <i data-lucide="banknote"></i>
              <span>${job.salary || 'N/A'}</span>
            </div>
          </div>
          <p class="job-desc">${stripHtml(job.description).substring(0, 240)}...</p>
          ${sponsorSectionHtml}
        </div>
        <div class="job-actions">
          <span class="time-stamp">${relativeTime}</span>
          <a href="${job.url}" target="_blank" class="btn btn-outline-violet btn-sm">
            Apply <i data-lucide="external-link" style="width:12px;height:12px"></i>
          </a>
        </div>
      `;
      jobsContainer.appendChild(card);
    });
    lucide.createIcons();
  }

  // 2. Fetch Jobs
  async function fetchJobs() {
    const onlySponsored = checkOnlySponsored.checked;
    try {
      const res = await fetch(`/api/jobs?only_sponsored=${onlySponsored}`);
      if (!res.ok) throw new Error();
      loadedJobs = await res.json();
      
      // Filter list immediately based on current query if any
      const query = jobSearchInput.value.toLowerCase().trim();
      if (query) {
        const filtered = loadedJobs.filter(job => {
          return job.title.toLowerCase().includes(query) || 
                 job.company.toLowerCase().includes(query) || 
                 job.location.toLowerCase().includes(query) || 
                 job.description.toLowerCase().includes(query);
        });
        renderJobs(filtered);
      } else {
        renderJobs(loadedJobs);
      }
    } catch (err) {
      jobsContainer.innerHTML = `<p class="text-crimson">Failed to load jobs. Please refresh.</p>`;
    }
  }

  function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  // Format date relatively
  function formatRelativeTime(date) {
    const diffMs = new Date() - date;
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  }

  // Check checkboxes
  function checkBoxesByValues(checkboxName, valuesJson) {
    try {
      const values = JSON.parse(valuesJson || '[]');
      document.querySelectorAll(`input[name="${checkboxName}"]`).forEach(cb => {
        cb.checked = values.includes(cb.value);
      });
    } catch (e) {
      console.error(`Failed to parse checkboxes values for ${checkboxName}`, e);
    }
  }

  // 3. Fetch Settings
  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error();
      const settings = await res.json();
      
      savedEmail = settings.email_recipient || '';
      emailInput.value = savedEmail;
      
      checkActiveScraper.checked = settings.is_scraper_enabled === '1';
      inputInterval.value = settings.check_interval_hours || '12';
      
      // Select Checkboxes
      checkBoxesByValues('domain', settings.filter_domains);
      checkBoxesByValues('experience', settings.filter_experience);
      checkBoxesByValues('job-type', settings.filter_job_types);
      checkOnlySponsoredAlerts.checked = settings.filter_only_sponsored === '1';
      
      // SMTP Inputs
      smtpHost.value = settings.smtp_host || '';
      smtpPort.value = settings.smtp_port || '587';
      smtpSecure.checked = settings.smtp_secure === '1';
      smtpUser.value = settings.smtp_user || '';
      smtpPass.value = '';
      if (settings.smtp_pass_set) {
        smtpPass.placeholder = '•••••••••••••••• (Saved)';
      } else {
        smtpPass.placeholder = 'Password or Google App Key';
      }
      
      // API Keys
      adzunaId.value = settings.adzuna_app_id || '';
      adzunaKey.value = '';
      if (settings.adzuna_app_key) {
        adzunaKey.placeholder = '•••••••••••••••• (Saved)';
      }
      
      reedKey.value = '';
      if (settings.reed_api_key) {
        reedKey.placeholder = '•••••••••••••••• (Saved)';
      }
      
      geminiKey.value = '';
      if (settings.gemini_api_key) {
        geminiKey.placeholder = '•••••••••••••••• (Saved)';
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  // 4. Fetch Logs
  async function fetchLogs() {
    try {
      const res = await fetch('/api/logs');
      if (!res.ok) throw new Error();
      const logs = await res.json();
      
      logsConsoleContainer.innerHTML = '';
      if (logs.length === 0) {
        logsConsoleContainer.innerHTML = `<div class="log-line text-slate">No process logs cached. Trigger a scrape to log activity.</div>`;
        return;
      }
      
      logs.forEach(log => {
        const date = new Date(log.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour12: false });
        
        let levelClass = 'log-level-info';
        if (log.level === 'WARN') levelClass = 'log-level-warn';
        if (log.level === 'ERROR') levelClass = 'log-level-error';
        
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
          <span class="log-time">${timeStr}</span>
          <span class="log-level ${levelClass}">[${log.level}]</span>
          <span class="log-msg-text">${escapeHtml(log.message)}</span>
        `;
        logsConsoleContainer.appendChild(line);
      });
      
      logsConsoleContainer.scrollTop = logsConsoleContainer.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- SUBMISSIONS & BUTTON CLICKS ---

  // A. Save Email Form
  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_recipient: email })
      });
      if (!res.ok) throw new Error();
      savedEmail = email;
      showToast('Notification email saved successfully!');
      fetchStats();
    } catch (_) {
      showToast('Failed to save email address.', 'error');
    }
  });

  // B. Send Test Email
  btnTestEmail.addEventListener('click', async () => {
    if (!savedEmail) {
      showToast('Please save your email address first!', 'error');
      return;
    }
    
    btnTestEmail.disabled = true;
    btnTestEmail.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px;margin:0"></div> Sending test...';
    
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast(`Test email sent to ${savedEmail}! Check your inbox.`);
      } else {
        showToast(data.error || 'Failed to send test email.', 'error');
      }
    } catch (_) {
      showToast('Failed to send test email. Server error.', 'error');
    } finally {
      btnTestEmail.disabled = false;
      btnTestEmail.innerHTML = '<i data-lucide="send"></i> Send Test Alert Email';
      lucide.createIcons();
    }
  });

  // C. Save Configuration Form (AI Filters)
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedDomains = Array.from(document.querySelectorAll('input[name="domain"]:checked')).map(cb => cb.value);
    const selectedExp = Array.from(document.querySelectorAll('input[name="experience"]:checked')).map(cb => cb.value);
    const selectedTypes = Array.from(document.querySelectorAll('input[name="job-type"]:checked')).map(cb => cb.value);
    
    if (selectedDomains.length === 0) {
      showToast('Please select at least one SAP Security Domain filter.', 'error');
      return;
    }
    
    const body = {
      is_scraper_enabled: checkActiveScraper.checked ? '1' : '0',
      check_interval_hours: inputInterval.value,
      filter_domains: JSON.stringify(selectedDomains),
      filter_experience: JSON.stringify(selectedExp),
      filter_job_types: JSON.stringify(selectedTypes),
      filter_only_sponsored: checkOnlySponsoredAlerts.checked ? '1' : '0'
    };
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      showToast('Filter settings saved successfully!');
      fetchStats();
    } catch (_) {
      showToast('Failed to save settings.', 'error');
    }
  });

  // D. Save SMTP Details Form
  smtpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      smtp_host: smtpHost.value.trim(),
      smtp_port: smtpPort.value,
      smtp_secure: smtpSecure.checked ? '1' : '0',
      smtp_user: smtpUser.value.trim()
    };
    
    if (smtpPass.value) {
      body.smtp_pass = smtpPass.value;
    }
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      showToast('SMTP server configuration saved!');
      smtpPass.value = '';
      fetchSettings();
    } catch (_) {
      showToast('Failed to save SMTP credentials.', 'error');
    }
  });

  // E. Save API Keys Form
  apiKeysForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      adzuna_app_id: adzunaId.value.trim()
    };
    
    if (adzunaKey.value) body.adzuna_app_key = adzunaKey.value;
    if (reedKey.value) body.reed_api_key = reedKey.value;
    if (geminiKey.value) body.gemini_api_key = geminiKey.value;
    
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error();
      showToast('API Credentials saved successfully!');
      adzunaKey.value = '';
      reedKey.value = '';
      geminiKey.value = '';
      fetchSettings();
    } catch (_) {
      showToast('Failed to save API credentials.', 'error');
    }
  });

  // F. Trigger Job Scrape
  btnRunScrape.addEventListener('click', async () => {
    btnRunScrape.disabled = true;
    showToast('Job search triggered. Checking UK boards...');
    
    try {
      const res = await fetch('/api/trigger-scrape', { method: 'POST' });
      if (!res.ok) throw new Error();
      setTimeout(fetchStats, 1000);
      setTimeout(fetchLogs, 1500);
    } catch (_) {
      showToast('Failed to trigger scan.', 'error');
      btnRunScrape.disabled = false;
    }
  });

  // G. Force Sync Sponsors
  btnSyncSponsors.addEventListener('click', async () => {
    btnSyncSponsors.disabled = true;
    btnSyncSponsors.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px;margin:0"></div> Syncing...';
    showToast('Triggered UK Sponsor list sync from GOV.UK. This takes ~15 seconds.');
    
    try {
      const res = await fetch('/api/sync-sponsors', { method: 'POST' });
      if (!res.ok) throw new Error();
      setTimeout(fetchStats, 2000);
      setTimeout(fetchLogs, 3000);
    } catch (_) {
      showToast('Failed to trigger sync.', 'error');
    } finally {
      setTimeout(() => {
        btnSyncSponsors.disabled = false;
        btnSyncSponsors.innerHTML = '<i data-lucide="download-cloud"></i> Sync GOV.UK Sponsors List';
        lucide.createIcons();
      }, 15000);
    }
  });

  // H. Filter Toggle
  checkOnlySponsored.addEventListener('change', fetchJobs);

  // I. Real-time Sponsor Directory Search (Debounced)
  let searchTimeout = null;
  sponsorSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      sponsorsContainer.innerHTML = `
        <div class="empty-state">
          <i data-lucide="search"></i>
          <p>Enter a query above to search the UK Home Office licensed sponsor register.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }
    
    sponsorsContainer.innerHTML = `
      <div class="loader-container">
        <div class="spinner"></div>
        <p>Querying sponsor registry...</p>
      </div>
    `;
    
    searchTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sponsors?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        sponsorsContainer.innerHTML = '';
        if (data.results.length === 0) {
          sponsorsContainer.innerHTML = `
            <div class="empty-state">
              <i data-lucide="help-circle"></i>
              <p>No sponsors found matching "${query}".</p>
            </div>
          `;
          lucide.createIcons();
          return;
        }
        
        data.results.forEach(sp => {
          const row = document.createElement('div');
          row.className = 'sponsor-row-card';
          row.innerHTML = `
            <div class="sponsor-meta">
              <div class="sponsor-name">${sp.name}</div>
              <div class="sponsor-location">
                <i data-lucide="map-pin" style="width:12px;height:12px;vertical-align:middle;display:inline;margin-right:4px;"></i>
                ${sp.town}${sp.county ? ', ' + sp.county : ''}
              </div>
            </div>
            <div class="sponsor-badges" style="display:flex; align-items:center; gap:8px;">
              <span class="pill-badge pill-badge-rating">${sp.tier_rating}</span>
              <span class="pill-badge pill-badge-route">${sp.route}</span>
              <a href="https://www.google.com/search?q=${encodeURIComponent(sp.name + ' careers jobs UK')}" target="_blank" class="btn btn-outline-cyan btn-sm" style="padding:4px 8px; font-size:11px; display:inline-flex; align-items:center; gap:4px; text-decoration:none;">
                Careers <i data-lucide="external-link" style="width:12px;height:12px;"></i>
              </a>
            </div>
          `;
          sponsorsContainer.appendChild(row);
        });
        lucide.createIcons();
      } catch (_) {
        sponsorsContainer.innerHTML = `<p class="text-crimson">Search failed. Try again.</p>`;
      }
    }, 300);
  });

  // Real-time filtering for discovered jobs list
  jobSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderJobs(loadedJobs);
      return;
    }
    
    const filtered = loadedJobs.filter(job => {
      return job.title.toLowerCase().includes(query) || 
             job.company.toLowerCase().includes(query) || 
             job.location.toLowerCase().includes(query) || 
             job.description.toLowerCase().includes(query);
    });
    renderJobs(filtered);
  });

  // J. Tabs Navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  // --- INITIALIZATION ---
  fetchStats();
  fetchJobs();
  fetchSettings();
  
  statsInterval = setInterval(fetchStats, 6000);
  setInterval(() => {
    if (currentTab === 'jobs') fetchJobs();
  }, 15000);
});
