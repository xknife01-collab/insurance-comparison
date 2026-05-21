
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function postBatch(table, data, conflictCols) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
    if (conflictCols) url.searchParams.set('on_conflict', conflictCols);
    
    const options = {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      }
    };
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`Status ${res.statusCode}: ${body}`));
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function runSync() {
  const data = JSON.parse(fs.readFileSync('scripts/scraper/unified_products_final.json', 'utf8'));
  console.log(`[*] Syncing ${data.length} products to DB...`);

  const products = [];
  const rates = [];

  data.forEach(item => {
    const prodCode = `${item.company}_${item.product_name}`.substring(0, 90).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    products.push({
      product_code: prodCode,
      company_name: item.company,
      display_name: item.product_name,
      category: item.category,
      standard_code: prodCode.substring(0, 20)
    });

    // Main product rates
    Object.entries(item.rates).forEach(([key, val]) => {
      if (val === 0) return;
      const match = key.match(/premium_([MF])_(\d+)/);
      if (match) {
        rates.push({
          product_code: prodCode,
          gender: match[1],
          age: parseInt(match[2]),
          job_class: 1,
          rate_data: { premium: val, basis: "Unified Python Loader" }
        });
      }
    });

    // Coverage-specific rates (The most accurate for Silson)
    item.coverages.forEach(cov => {
       Object.entries(cov.premiums).forEach(([key, val]) => {
         if (val === 0) return;
         const match = key.match(/premium_([MF])_(\d+)/);
         if (match) {
            const rKey = `${prodCode}_${match[1]}_${match[2]}`;
            // We sum coverage premiums into the total for that age/gender
            const existing = rates.find(r => r.product_code === prodCode && r.gender === match[1] && r.age === parseInt(match[2]));
            if (existing) {
              existing.rate_data.premium += val;
            } else {
              rates.push({
                product_code: prodCode,
                gender: match[1],
                age: parseInt(match[2]),
                job_class: 1,
                rate_data: { premium: val, basis: `Sum: ${cov.name}` }
              });
            }
         }
       });
    });
  });

  console.log(`[*] Finalizing ${products.length} unique products and ${rates.length} rates...`);

  try {
    // Unique products
    const uniqueProds = Array.from(new Map(products.map(p => [p.product_code, p])).values());
    await postBatch('insurance_products', uniqueProds, 'product_code');
    console.log(`[+] Uploaded ${uniqueProds.length} products.`);

    // Batch upload rates (1000 at a time)
    for (let i = 0; i < rates.length; i += 1000) {
      await postBatch('insurance_rates', rates.slice(i, i + 1000), 'product_code,gender,age,job_class');
      process.stdout.write(`.`);
    }
    console.log(`\n[+] Uploaded ${rates.length} rates.`);
    console.log("[*] ALL DATA SYNCED SUCCESSFULLY.");
  } catch (e) {
    console.error("[-] Sync Error:", e.message);
  }
}

runSync();
