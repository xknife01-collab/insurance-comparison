
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAge40Rates() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_rates?age=eq.40&limit=50&select=product_code,gender,rate_data`);
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
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  const data = await getAge40Rates();
  console.log('--- Sample Rates for Age 40 ---');
  data.forEach(r => {
    console.log(`Code: ${r.product_code} | Premium: ${r.rate_data.premium}`);
  });
}

run();
