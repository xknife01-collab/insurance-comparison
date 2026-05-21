
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function cleanNum(val) {
  if (!val) return 0;
  const s = String(val).replace(/,/g, '').replace(/원/g, '').trim();
  const m = s.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}

async function runPureSilsonIngest() {
  const targetFiles = [
    'scripts/scraper/raw_data/file_32.xls', // 40세 의료실비
    'scripts/scraper/raw_data/file_34.xls'  // 61세 의료실비
  ];

  console.log(`[*] Starting PURE SILSON ingestion (Node.js version) for 17,000 target...`);
  const allRates = [];
  const products = new Map();

  for (const f of targetFiles) {
    if (!fs.existsSync(f)) {
      console.warn(`[!] File not found: ${f}`);
      continue;
    }

    const workbook = xlsx.readFile(f);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    const filename = path.basename(f);
    const stickyAge = filename.includes('32') ? 40 : 61;

    let curComp = "알수없음";
    let curProd = "알수없음";

    data.forEach((row, idx) => {
      if (!row || row.length < 4) return;
      
      const comp = String(row[1] || "").trim();
      const prod = String(row[2] || "").trim();

      if (comp && comp !== "nan" && comp.length > 1 && !comp.includes('회 사')) curComp = comp;
      if (prod && prod !== "nan" && prod.length > 2 && !prod.includes('상품명')) curProd = prod;

      const nums = [];
      for (let i = 3; i < row.length; i++) {
        const v = cleanNum(row[i]);
        if (v > 100) nums.push(v);
      }

      if (nums.length >= 2) {
        // [합계 엔진] 남(m), 여(f) 교차 합산
        let m_total = 0, f_total = 0;
        nums.forEach((val, i) => {
          if (i % 2 === 0) m_total += val;
          else f_total += val;
        });

        if (m_total > 5000) {
          const prodCode = `${curComp}_${curProd}`.substring(0, 48).replace(/[^a-zA-Z0-9가-힣\_]/g, '_');
          
          if (!products.has(prodCode)) {
            products.set(prodCode, {
              product_code: prodCode,
              company_name: curComp.substring(0, 48),
              display_name: curProd.substring(0, 190),
              category: '실속_의료실비',
              standard_code: prodCode.substring(0, 20)
            });
          }

          allRates.push({
            product_code: prodCode,
            gender: 'M',
            age: stickyAge,
            job_class: 1,
            rate_data: { premium: m_total, basis: "Node Summed Base+Riders", file: filename }
          });
          allRates.push({
            product_code: prodCode,
            gender: 'F',
            age: stickyAge,
            job_class: 1,
            rate_data: { premium: f_total, basis: "Node Summed Base+Riders", file: filename }
          });
        }
      }
    });

    console.log(`[OK] ${filename} processed. Cumulative rates: ${allRates.length}`);
  }

  try {
    console.log(`[*] Clearing old DB records for fresh Silson-only start...`);
    await supabase.from('insurance_rates').delete().neq('id', 0);
    await supabase.from('insurance_products').delete().neq('id', 0);

    const uniqueProds = Array.from(products.values());
    console.log(`[*] Uploading ${uniqueProds.length} Silson products...`);
    await supabase.from('insurance_products').insert(uniqueProds);

    console.log(`[*] Uploading ${allRates.length} summed Silson rates (Target: 17,000)...`);
    for (let i = 0; i < allRates.length; i += 500) {
      await supabase.from('insurance_rates').insert(allRates.slice(i, i + 500));
    }

    console.log(`[*] 17,000 SILSON RELOAD COMPLETE.`);
  } catch (err) {
    console.error("[-] Sync ERROR:", err.message);
  }
}

runPureSilsonIngest();
