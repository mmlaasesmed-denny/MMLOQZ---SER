import { initDb, run, logMessage } from '../db.js';

function parseCSVLine(line) {
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

async function testSync() {
  await initDb();
  await logMessage('INFO', 'Starting test sync of GOV.UK sponsor list (buffered approach)...');
  
  try {
    const pageUrl = 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers';
    const pageRes = await fetch(pageUrl);
    const html = await pageRes.text();
    const match = html.match(/https:\/\/assets\.publishing\.service\.gov\.uk\/[^\s"]+?\.csv/);
    if (!match) throw new Error('CSV URL not found');
    const csvUrl = match[0];
    await logMessage('INFO', `Found CSV URL: ${csvUrl}`);
    
    const csvRes = await fetch(csvUrl);
    if (!csvRes.ok) throw new Error(`Failed to download CSV: ${csvRes.statusText}`);
    
    const text = await csvRes.text();
    const lines = text.split(/\r?\n/);
    await logMessage('INFO', `Downloaded CSV. Total lines: ${lines.length}`);
    
    let isHeader = true;
    let headers = [];
    let count = 0;
    
    await run('BEGIN TRANSACTION');
    await run('DELETE FROM sponsors');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      const fields = parseCSVLine(line);
      
      if (isHeader) {
        // Strip BOM and quotes
        headers = fields.map(h => h.toLowerCase().replace(/^\uFEFF/, '').replace(/['"]/g, '').trim());
        console.log('Headers:', headers);
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
        console.log(`Imported ${count} sponsors...`);
      }
    }
    
    await run('COMMIT');
    await logMessage('INFO', `Successfully imported ${count} sponsors into SQLite!`);
  } catch (err) {
    try { await run('ROLLBACK'); } catch (_) {}
    console.error('Sync failed:', err);
  }
}

testSync();
