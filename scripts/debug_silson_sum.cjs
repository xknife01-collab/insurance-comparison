
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getProductRates(productPattern) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_rates?product_code=ilike.*${productPattern}*&select=product_code,age,gender,rate_data`);
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
  const data = await getProductRates('한화생명');
  console.log('--- Rates for 한화생명 ---');
  data.forEach(r => {
    console.log(`Code: ${r.product_code} | Age: ${r.age} | Premium: ${r.rate_data.premium}`);
  });
}

run();
