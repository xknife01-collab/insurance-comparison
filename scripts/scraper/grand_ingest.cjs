
const fs = require('fs');
const path = require('path');
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

function parseHtml(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = [];
  const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  trMatches.forEach(tr => {
    const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  });
  return rows;
}

const root = 'scripts/scraper/raw_data';
const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls')).sort();

async function load() {
  console.log('[*] STARTING INDIVIDUAL FILE-BY-FILE INGESTION (TOTAL 56 FILES)');
  let totalRates = 0;

  for (const file of allFiles) {
    console.log(`\n-----------------------------------------`);
    console.log(`[*] Processing: ${file}`);
    const table = parseHtml(path.join(root, file));
    const prefix = file.replace(/_20\d+/g, '').replace(/\.xls$/, '').substring(0, 30);
    const category = prefix;

    let lastCompany = '', lastProduct = '';
    const maleCols = [], femaleCols = [];
    
    // Header detection
    for(let i=0; i<10 && i<table.length; i++) {
        table[i].forEach((h, idx) => {
            if (h.includes("남")) maleCols.push({idx, age: h.match(/(\d+)세/)?.[1] || "40"});
            if (h.includes("여")) femaleCols.push({idx, age: h.match(/(\d+)세/)?.[1] || "40"});
        });
    }

    const ratesMap = new Map(); // Use Map to deduplicate by key
    const productsMap = new Map();

    for (let i=4; i<table.length; i++) {
        const row = table[i];
        if (row.length < 3) continue;
        const comp = (!row[0].includes("남") && row[0].length > 1) ? row[0] : lastCompany;
        const prod = (!row[1].includes("남") && row[1].length > 2) ? row[1] : lastProduct;
        if (comp) lastCompany = comp;
        if (prod) lastProduct = prod;
        if (!lastCompany || !lastProduct) continue;

        const prodCode = `${lastCompany}_${lastProduct}`.substring(0, 90).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
        productsMap.set(prodCode, { product_code: prodCode, company_name: lastCompany, display_name: lastProduct, category, standard_code: prodCode.substring(0, 20)});

        const basis = row.join(' ');
        const age = parseInt(basis.match(/(\d+)세/)?.[1] || 40);

        maleCols.forEach(mc => {
            const val = parseFloat(row[mc.idx]?.replace(/[^0-9.]/g, '')) || 0;
            if (val > 100) {
                const ageNum = parseInt(mc.age);
                const key = `${prodCode}_M_${ageNum}`;
                const existing = ratesMap.get(key);
                if (existing) {
                    existing.rate_data.premium += val;
                    existing.rate_data.basis = (existing.rate_data.basis + ' | ' + basis.substring(0, 30)).substring(0, 100);
                } else {
                    ratesMap.set(key, { product_code: prodCode, gender: 'M', age: ageNum, job_class: 1, rate_data: { premium: val, basis: basis.substring(0, 50) }});
                }
            }
        });
        femaleCols.forEach(fc => {
            const val = parseFloat(row[fc.idx]?.replace(/[^0-9.]/g, '')) || 0;
            if (val > 100) {
                const ageNum = parseInt(fc.age);
                const key = `${prodCode}_F_${ageNum}`;
                const existing = ratesMap.get(key);
                if (existing) {
                    existing.rate_data.premium += val;
                    existing.rate_data.basis = (existing.rate_data.basis + ' | ' + basis.substring(0, 30)).substring(0, 100);
                } else {
                    ratesMap.set(key, { product_code: prodCode, gender: 'F', age: ageNum, job_class: 1, rate_data: { premium: val, basis: basis.substring(0, 50) }});
                }
            }
        });
    }

    const prodList = Array.from(productsMap.values());
    const rateList = Array.from(ratesMap.values());
    console.log(`  - Parsed: ${prodList.length} Prods, ${rateList.length} Rates`);

    try {
        if (prodList.length > 0) await postBatch('insurance_products', prodList, 'product_code');
        if (rateList.length > 0) {
            for (let k=0; k<rateList.length; k+=100) {
                await postBatch('insurance_rates', rateList.slice(k, k+100), 'product_code,gender,age,job_class');
                totalRates += Math.min(100, rateList.length - k);
            }
        }
        console.log(`  - [OK] ${file} fully synced.`);
    } catch (e) { console.error(`  - [ERR] ${file}: ${e.message}`); }
  }
  console.log(`\n[*] FINISHED. TOTAL RATES SYNCED: ${totalRates}`);
}

load();
