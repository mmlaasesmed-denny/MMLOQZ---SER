import { initDb, get } from '../db.js';
import { findSponsorMatch, cleanCompanyName, runFullScrape } from '../scraper.js';

async function testMatch() {
  await initDb();
  console.log('Testing company name normalization and SQLite matching...');
  
  const testCases = [
    'Accenture UK Ltd',
    'Accenture',
    'ALT Glasgow',
    'BOLTWHIZ LIMITED',
    'NonExistentCompany123'
  ];
  
  for (const company of testCases) {
    const cleanName = cleanCompanyName(company);
    const match = await findSponsorMatch(company);
    if (match) {
      console.log(`\n[MATCH] "${company}" (Cleaned: "${cleanName}") matches sponsor:`);
      console.log(`  - Name:   ${match.name}`);
      console.log(`  - City:   ${match.town}`);
      console.log(`  - Rating: ${match.tier_rating}`);
      console.log(`  - Route:  ${match.route}`);
    } else {
      console.log(`\n[NO MATCH] "${company}" (Cleaned: "${cleanName}") is not a licensed sponsor.`);
    }
  }
  
  console.log('\nTesting full scrape execution (mock trigger)...');
  try {
    await runFullScrape();
    console.log('Scraper ran successfully without crashing!');
  } catch (err) {
    console.error('Scraper run crashed:', err);
  }
}

testMatch();
