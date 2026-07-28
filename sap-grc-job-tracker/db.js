import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'tracker.db');

const db = new sqlite3.Database(dbPath);

// Promise-based wrappers for sqlite3
export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Transaction helpers
export function serialize(fn) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      fn()
        .then(resolve)
        .catch(reject);
    });
  });
}

// Initialize tables
export async function initDb() {
  // Create tables
  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS sponsors (
      name TEXT PRIMARY KEY,
      town TEXT,
      county TEXT,
      tier_rating TEXT,
      route TEXT
    )
  `);
  
  // Create index on lower-case sponsor name for faster matching
  await run(`CREATE INDEX IF NOT EXISTS idx_sponsors_name ON sponsors(name)`);

  await run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT,
      company TEXT,
      location TEXT,
      description TEXT,
      url TEXT,
      salary TEXT,
      date_posted TEXT,
      is_sponsored INTEGER DEFAULT 0,
      sponsor_details TEXT,
      date_found TEXT,
      notified INTEGER DEFAULT 0
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      level TEXT,
      message TEXT
    )
  `);

  // Seed default settings if they do not exist
  const defaultSettings = {
    email_recipient: '',
    check_interval_hours: '12',
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_secure: '0', // '1' for true, '0' for false
    adzuna_app_id: '',
    adzuna_app_key: '',
    reed_api_key: '',
    is_scraper_enabled: '1',
    search_keywords: JSON.stringify(['SAP GRC', 'SAP Security', 'SAP GRC Consultant', 'GRC Security']),
    last_scraper_run: '',
    last_scraper_status: 'idle', // 'idle', 'running', 'success', 'error'
    last_sponsor_sync: '',
    filter_domains: JSON.stringify(['SAP GRC', 'SAP Security & Authorizations', 'SAP S/4HANA Security']),
    filter_experience: JSON.stringify(['Senior / Lead', 'Manager / Architect']),
    filter_job_types: JSON.stringify(['Permanent', 'Contract']),
    filter_only_sponsored: '1'
  };

  for (const [key, val] of Object.entries(defaultSettings)) {
    await run(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`, [key, val]);
  }
}

// Settings utility helpers
export async function getSettings() {
  const rows = await all(`SELECT key, value FROM settings`);
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function saveSettings(settingsObj) {
  for (const [key, val] of Object.entries(settingsObj)) {
    await run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, String(val)]);
  }
}

// Logging utility helper
export async function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  await run(`INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)`, [timestamp, level, message]);
  console.log(`[${timestamp}] [${level}] ${message}`);
}
