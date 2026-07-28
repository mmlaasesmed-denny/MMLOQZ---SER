import { initDb, getSettings, saveSettings } from '../db.js';

async function testFilters() {
  await initDb();
  console.log('Testing settings database persistence for advanced filters...');
  
  // Set test filters
  const testSettings = {
    filter_domains: JSON.stringify(['SAP GRC', 'SAP IAG']),
    filter_experience: JSON.stringify(['Senior / Lead (6+ years)']),
    filter_job_types: JSON.stringify(['Permanent']),
    filter_only_sponsored: '1'
  };
  
  await saveSettings(testSettings);
  console.log('Filters saved successfully!');
  
  // Retrieve settings and log them
  const retrieved = await getSettings();
  console.log('\nRetrieved settings from SQLite:');
  console.log(`- Domains:    ${retrieved.filter_domains}`);
  console.log(`- Experience: ${retrieved.filter_experience}`);
  console.log(`- Job Types:  ${retrieved.filter_job_types}`);
  console.log(`- Visa Only:  ${retrieved.filter_only_sponsored}`);
  
  // Verify array parsing
  const domains = JSON.parse(retrieved.filter_domains);
  const experience = JSON.parse(retrieved.filter_experience);
  const types = JSON.parse(retrieved.filter_job_types);
  
  console.log('\nVerification array checklist:');
  console.log(`- Domain matches expected?   ${domains.includes('SAP GRC') && domains.includes('SAP IAG')}`);
  console.log(`- Experience matches expected? ${experience.includes('Senior / Lead (6+ years)')}`);
  console.log(`- Job type matches expected?   ${types.includes('Permanent')}`);
}

testFilters();
