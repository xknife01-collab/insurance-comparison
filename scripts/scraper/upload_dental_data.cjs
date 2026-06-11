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
  const dumpPath = 'scripts/scraper/dental_dump.json';
  if (!fs.existsSync(dumpPath)) {
    console.error("[-] dental_dump.json not found. Run the dental scraper first.");
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
  console.log(`[*] Loading ${rawData.length} dental items from ${dumpPath}...`);

  const category = '치아_보험';
  const products = [];
  const rates = [];

  rawData.forEach((item, idx) => {
    // [노이즈 제거 필터]
    const fullText = (item.company + item.product).replace(/\s/g, '');
    const isJunk = fullText.includes('치아파절제외') || fullText.includes('골절') || fullText.includes('상해');
    if (isJunk) return;

    const cleanComp = (item.company || '알수없음').substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    const cleanProd = (item.product || `P_${idx}`).substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
    const prodCode = `DENT_${cleanComp}_${cleanProd}`.substring(0, 48);

    products.push({
      product_code: prodCode,
      company_name: item.company.substring(0, 48),
      display_name: (item.company + " " + item.product).substring(0, 190),
      category: category,
      standard_code: prodCode.substring(0, 45)
    });

    if (item.m > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'M',
        age: item.age,
        job_class: 1,
        rate_data: { premium: item.m, basis: "Summed Dental Coverage", file: "dental_xls" }
      });
    }

    if (item.f > 0) {
      rates.push({
        product_code: prodCode,
        gender: 'F',
        age: item.age,
        job_class: 1,
        rate_data: { premium: item.f, basis: "Summed Dental Coverage", file: "dental_xls" }
      });
    }
  });

  const uniqueProds = Array.from(new Map(products.map(p => [p.product_code, p])).values());
  const uniqueRates = Array.from(new Map(rates.map(r => [`${r.product_code}_${r.gender}_${r.age}`, r])).values());

  try {
    // 1. [핵심] 치아보험 전용 금고 초기화 (실물 테이블이 분리되어 있어 실비는 절대 안 죽음!)
    console.log(`[*] Clearing existing DENTAL_VAULT products and rates...`);
    
    // 이제 테이블 자체가 다르므로 그냥 싹 밀어도 실비(medical_silson)는 안전합니다.
    await supabase.from('dental_rates').delete().neq('id', 0);
    await supabase.from('dental_products').delete().neq('id', 0);

    // 2. Upload Products
    console.log(`[*] Syncing ${uniqueProds.length} unique DENTAL products to DB...`);
    for (let i = 0; i < uniqueProds.length; i += 100) {
       await supabase.from('dental_products').insert(uniqueProds.slice(i, i + 100));
       process.stdout.write(".");
    }
    console.log(`\n[+] Products updated.`);

    // 3. Upload Rates
    console.log(`[*] Syncing ${uniqueRates.length} summed DENTAL rates to DB...`);
    for (let i = 0; i < uniqueRates.length; i += 400) {
       await supabase.from('dental_rates').insert(uniqueRates.slice(i, i + 400));
       process.stdout.write(".");
    }
    console.log(`\n[+] DENTAL VAULT LOADED. (High Security Isolation Applied)`);
  } catch (e) {
    console.error("[-] Sync ERROR:", e.message);
  }
}

runUpload();
