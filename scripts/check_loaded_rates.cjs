
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getRatesSample() {
  return new Promise((resolve, reject) => {
    // Get products that have more than 1 rate
    const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_rates?select=product_code,gender,age&limit=20`);
    const options = {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    };
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const data = await getRatesSample();
  console.log('--- Sample of Loaded Rates ---');
  data.forEach(r => console.log(`Prod: ${r.product_code} | Gender: ${r.gender} | Age: ${r.age}`));
}

run();
