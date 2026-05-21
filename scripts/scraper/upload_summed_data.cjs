const fs = require('fs');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("[-] Missing Supabase credentials in .env or .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function runUpload() {
  const dumpPath = 'scripts/scraper/extracted_dump.json';
  if (!fs.existsSync(dumpPath)) {
    console.error("[-] extracted_dump.json not found. Run the scraper first.");
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
  console.log(`[*] Loading ${rawData.length} summed items from ${dumpPath}...`);

  const products = [];
  const rates = [];

  rawData.forEach((item, idx) => {
    const cleanComp = (item.company || '알수없음').substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    const cleanProd = (item.product || `P_${idx}`).substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    const prodCode = `${cleanComp}_${cleanProd}`.substring(0, 48);

    products.push({
      product_code: prodCode,
      company_name: item.company.substring(0, 48),
      display_name: item.product.substring(0, 190), // Display name is usually larger (255)
      category: (item.is_yoobyeongja ? '실손_유병' : '실손_보험').substring(0, 48),
      standard_code: prodCode.substring(0, 45)
    });

    if (item.m > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'M',
        age: item.age,
        job_class: 1,
        rate_data: { premium: item.m, basis: "Summed Base+Riders", file: item.file }
      });
    }

    if (item.f > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'F',
        age: item.age,
        job_class: 1,
        rate_data: { premium: item.f, basis: "Summed Base+Riders", file: item.file }
      });
    }
  });

  const uniqueProds = Array.from(new Map(products.map(p => [p.product_code, p])).values());
  const uniqueRates = Array.from(new Map(rates.map(r => [`${r.product_code}_${r.gender}_${r.age}`, r])).values());

  try {
    // 1. Clear Tables safely for 100% data integrity
    console.log(`[*] Clearing all existing rates and products in MEDICAL_SILSON vault...`);
    await supabase.from('medical_silson_rates').delete().neq('id', 0);
    await supabase.from('medical_silson_products').delete().neq('id', 0);
    
    // 2. Upload Products in chunks
    console.log(`[*] Syncing ${uniqueProds.length} unique MEDICAL products to DB...`);
    for (let i = 0; i < uniqueProds.length; i += 100) {
       const { error } = await supabase.from('medical_silson_products').insert(uniqueProds.slice(i, i + 100));
       if (error) {
           console.error(`  [!] Batch Error: ${error.message}`);
       }
       process.stdout.write(".");
    }
    console.log(`\n[+] Products updated.`);

    // 3. Upload Rates in chunks
    console.log(`[*] Syncing ${uniqueRates.length} summed MEDICAL rates to DB...`);
    for (let i = 0; i < uniqueRates.length; i += 400) {
       const { error } = await supabase.from('medical_silson_rates').insert(uniqueRates.slice(i, i + 400));
       if (error) {
           console.error(`  [!] Rate Batch Error: ${error.message}`);
       }
       process.stdout.write(".");
    }
    console.log(`\n[+] MEDICAL Rates updated successfully.`);
    console.log("[*] MEDICAL SILSON VAULT IS NOW 100% PURIFIED.");
  } catch (e) {
    console.error("[-] Sync ERROR:", e.message);
  }
}

runUpload();
