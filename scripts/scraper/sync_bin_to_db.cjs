
const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
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
  if (!fs.existsSync('scripts/scraper/extracted_dump.json')) {
      console.error("[-] extracted_dump.json not found.");
      return;
  }
  const raw = JSON.parse(fs.readFileSync('scripts/scraper/extracted_dump.json', 'utf8'));
  console.log(`[*] Syncing ${raw.length} raw binary rows to DB...`);

  const products = [];
  const rates = [];

  raw.forEach(item => {
    const prodCode = `${item.company}_${item.product}`.substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    
    let category = "보장성";
    if (item.file.includes("실손") || item.file.includes("실비")) category = "실손";
    else if (item.file.includes("치아")) category = "치아";
    
    products.push({
      product_code: prodCode,
      company_name: item.company.substring(0, 50),
      display_name: item.product.substring(0, 100),
      category: category,
      standard_code: item.file.substring(0, 40)
    });

    const assignedAge = item.age || 40;
    
    // We put is_yoobyeongja inside rate_data to avoid schema lock-in
    if (item.m > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'M',
        age: assignedAge,
        job_class: 1,
        rate_data: { 
            [`r${item.row}`]: item.m, 
            source: item.file, 
            is_yoobyeongja: !!item.is_yoobyeongja 
        }
      });
    }
    if (item.f > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'F',
        age: assignedAge,
        job_class: 1,
        rate_data: { 
            [`r${item.row}`]: item.f, 
            source: item.file, 
            is_yoobyeongja: !!item.is_yoobyeongja 
        }
      });
    }
  });

  try {
    const uniqueProds = Array.from(new Map(products.map(p => [p.product_code, p])).values());
    await postBatch('insurance_products', uniqueProds, 'product_code');
    console.log(`[+] Synced ${uniqueProds.length} products.`);

    const mergedRates = new Map();
    rates.forEach(r => {
      const key = `${r.product_code}_${r.gender}_${r.age}_${r.job_class}`;
      if (!mergedRates.has(key)) {
        mergedRates.set(key, r);
      } else {
        const existing = mergedRates.get(key);
        Object.assign(existing.rate_data, r.rate_data);
      }
    });

    const finalRates = Array.from(mergedRates.values());
    console.log(`[*] Inserting ${finalRates.length} rate packages...`);

    for (let i = 0; i < finalRates.length; i += 200) {
      await postBatch('insurance_rates', finalRates.slice(i, i + 200), 'product_code,gender,age,job_class');
      process.stdout.write(".");
    }
    console.log(`\n[+] DB Sync Complete.`);
  } catch (e) {
    console.error("[-] Sync Error:", e.message);
  }
}

runSync();
