
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSilsonData() {
  return new Promise((resolve, reject) => {
    // Search for Silson products in insurance_products
    const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_products?category=ilike.*실손*&select=product_code,display_name`);
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

function getRatesForProduct(prodCode) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_rates?product_code=eq.${prodCode}&select=gender,age,rate_data`);
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

async function analyze() {
  const silsonProds = await getSilsonData();
  console.log(`[*] Found ${silsonProds.length} Silson Products.`);
  
  for (let i = 0; i < Math.min(3, silsonProds.length); i++) {
    const p = silsonProds[i];
    const rates = await getRatesForProduct(p.product_code);
    console.log(`\nProd: ${p.display_name} (${p.product_code})`);
    console.log(`Rates sample:`, rates.slice(0, 2));
  }
}

analyze();
