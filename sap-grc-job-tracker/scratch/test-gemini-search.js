import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testSearch() {
  console.log('Querying gemini-3.5-flash with Google Search Grounding for SAP GRC Security Consultant jobs in the UK...');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Search the web for the latest SAP GRC Security Consultant job openings in the UK. Return a list of active job posts as a JSON array. Each object in the array should have: title, company, location, description (short summary), url (the citation link or direct job link), salary, and date_posted.',
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

    console.log('Response text:');
    console.log(response.text);
    
    const jobs = JSON.parse(response.text);
    console.log(`Found ${jobs.length} jobs via Gemini search grounding.`);
    if (jobs.length > 0) {
      console.log('First job matched:', JSON.stringify(jobs[0], null, 2));
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

testSearch();
