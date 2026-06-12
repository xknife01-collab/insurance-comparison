import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environmental variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Service Role Key not found in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const result: string[][] = [];
  
  for (let line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let inQuotes = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }
  return result;
}

function cleanNum(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/[^0-9.]/g, '').trim();
  const num = parseInt(clean);
  return isNaN(num) ? 0 : num;
}

function cleanRate(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/[^0-9.]/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

function getNormalizationFactor(amountStr: string, isRider: boolean): number {
  if (!amountStr) return 1.0;
  
  const clean = amountStr.replace(/\s+/g, '').replace(/,/g, '');
  const numMatch = clean.match(/^[0-9.]+/);
  if (!numMatch) return 1.0;
  
  const numVal = parseFloat(numMatch[0]);
  if (numVal <= 0) return 1.0;
  
  if (isRider) {
    // "특약이 천만원대면 10을 곱할것"
    if (clean.includes('천만원') || (clean.includes('만원') && numVal === 1000)) {
      return 10.0;
    }
    return 1.0;
  } else {
    // For main contract: normalize to 1억원
    if (clean.includes('억')) {
      return 1.0 / numVal; 
    }
    if (clean.includes('만원') || clean.includes('만')) {
      return 10000.0 / numVal;
    }
    return 100000.0 / numVal;
  }
}

interface GroupedProduct {
  company: string;
  product_name: string;
  sub_type: 'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving';
  file_type: string;
  main_m: number[];
  main_f: number[];
  riders_m: number[];
  riders_f: number[];
  declared_rates: number[];
  business_fees: number[];
  male_yields: number[];
  female_yields: number[];
}

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '5_savings', 'variable_term', 'extracted_data.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`[-] CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  
  if (rows.length < 2) {
    console.error("[-] CSV contains no data rows.");
    process.exit(1);
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  const companyIdx = headers.indexOf("보험회사");
  const productIdx = headers.indexOf("상품명");
  const gubunIdx = headers.indexOf("구분");
  const mPremiumIdx = headers.indexOf("기준보험료");
  const fPremiumIdx = headers.indexOf("가입보험료");
  const appliedRateIdx = headers.indexOf("적용이율");
  const amountIdx = headers.indexOf("가입금액");
  const subTypeIdx = headers.indexOf("sub_type");
  const fileTypeIdx = headers.indexOf("file_type");
  const renewalIdx = headers.indexOf("갱신구분");

  const raw13Idx = headers.indexOf("원본_열_13");
  const raw5Idx = headers.indexOf("원본_열_5");
  const raw8Idx = headers.indexOf("원본_열_8");

  console.log(`[*] Loaded Variable/Term CSV: ${dataRows.length} rows.`);

  const productGroups: { [key: string]: GroupedProduct } = {};

  dataRows.forEach((row) => {
    const company = row[companyIdx] || "";
    const productName = row[productIdx] || "";
    if (!company || !productName) return;

    const sub_type = subTypeIdx !== -1 ? (row[subTypeIdx] as any) : 'term_pure';
    const file_type = fileTypeIdx !== -1 ? row[fileTypeIdx] : 'binary';

    // Exclude renewable products for term insurance
    const isTermProduct = sub_type === 'term_pure' || sub_type === 'term_ceo' || sub_type === 'variable_term';
    if (isTermProduct) {
      const renewalVal = renewalIdx !== -1 ? (row[renewalIdx] || "").trim() : "";
      if (renewalVal === "갱신형") {
        return; 
      }
      const cleanName = productName.replace(/\s+/g, "");
      if (cleanName.includes("갱신") && !cleanName.includes("비갱신")) {
        return; 
      }
    }

    const key = `${company}||${productName}`;
    if (!productGroups[key]) {
      productGroups[key] = {
        company,
        product_name: productName,
        sub_type,
        file_type,
        main_m: [],
        main_f: [],
        riders_m: [],
        riders_f: [],
        declared_rates: [],
        business_fees: [],
        male_yields: [],
        female_yields: []
      };
    }

    const group = productGroups[key];
    const gubunVal = (row[gubunIdx] || "").replace(/\.0/g, '').replace(/년/g, '').trim();

    if (isTermProduct) {
      const amountStr = amountIdx !== -1 ? row[amountIdx] : "";
      const isRider = gubunVal === '특약';
      const normFactor = getNormalizationFactor(amountStr, isRider);
      
      let m_prem = cleanNum(row[mPremiumIdx]) * normFactor;
      let f_prem = cleanNum(row[fPremiumIdx]) * normFactor;
      const rate = cleanRate(row[appliedRateIdx]);
      
      if (gubunVal === '주계약') {
        if (m_prem > 0) group.main_m.push(m_prem);
        if (f_prem > 0) group.main_f.push(f_prem);
        if (rate > 0) group.declared_rates.push(rate);
      } else if (gubunVal === '특약') {
        if (m_prem > 0) group.riders_m.push(m_prem);
        if (f_prem > 0) group.riders_f.push(f_prem);
      }
    } else {
      if (gubunVal === '10') {
        const fee = raw13Idx !== -1 ? cleanRate(row[raw13Idx]) : 0;
        const male_yield = raw5Idx !== -1 ? cleanRate(row[raw5Idx]) : 0;
        const female_yield = raw8Idx !== -1 ? cleanRate(row[raw8Idx]) : 0;

        if (fee > 0) group.business_fees.push(fee);
        if (male_yield > 0) group.male_yields.push(male_yield);
        if (female_yield > 0) group.female_yields.push(female_yield);
      }
    }
  });

  const records: any[] = [];

  const companyYields: { [key: string]: number } = {
    "미래에셋생명": 6.8,
    "메트라이프생명": 6.2,
    "삼성생명": 5.2,
    "교보생명": 5.8,
    "신한라이프생명": 5.5,
    "KB라이프생명": 5.6,
    "iM라이프": 6.0,
    "하나생명": 5.4,
    "AIA생명": 5.5,
    "DB생명": 5.5,
    "동양생명": 5.5,
    "KDB생명": 5.4,
    "푸본현대생명": 5.5,
    "NH농협생명": 5.2
  };

  Object.values(productGroups).forEach((group) => {
    const isTerm = group.sub_type === 'term_pure' || group.sub_type === 'term_ceo' || group.sub_type === 'variable_term';
    
    let male_premium_40 = 0;
    let female_premium_40 = 0;
    let declared_rate = 2.5; 
    let business_fee = 12.0; 
    let features = "";

    if (isTerm) {
      const baseMainM = group.main_m.length > 0 ? Math.min(...group.main_m) : 0;
      const baseMainF = group.main_f.length > 0 ? Math.min(...group.main_f) : 0;
      
      if (baseMainM === 0 && baseMainF === 0) {
        return; 
      }

      const totalRidersM = group.riders_m.reduce((a, b) => a + b, 0);
      const totalRidersF = group.riders_f.reduce((a, b) => a + b, 0);

      male_premium_40 = baseMainM;
      female_premium_40 = baseMainF;

      if (group.declared_rates.length > 0) {
        declared_rate = group.declared_rates[0];
      }
      features = `MAIN_M:${baseMainM}|RIDER_M:${totalRidersM}|MAIN_F:${baseMainF}|RIDER_F:${totalRidersF}|사망보장금 1억원 기준 (주계약 + 특약 합산) | 납입기간별 보험료 차등 적용 | 비흡연/건강체 최대 15% 할인 가능`;
    } else {
      declared_rate = companyYields[group.company] || 5.5;

      if (group.business_fees.length > 0) {
        business_fee = group.business_fees[0];
      } else {
        business_fee = 6.5; 
      }

      const m_yield = group.male_yields.length > 0 ? group.male_yields[0] : 0;
      const f_yield = group.female_yields.length > 0 ? group.female_yields[0] : 0;

      if (m_yield > 0 || f_yield > 0) {
        features = `10년 납입 유지 시 예상 적립률: 남성 ${m_yield || f_yield}%, 여성 ${f_yield || m_yield}% | 납입 원금 특별계정 펀드 실적배당 투자 | 10년 이상 유지 시 비과세 혜택 및 중도 인출 기능`;
      } else {
        features = "납입 원금 특별계정 펀드 실적배당 투자 | 10년 이상 유지 시 비과세 혜택 | 연금 전환 옵션 탑재";
      }
    }

    records.push({
      company: group.company,
      product_name: group.product_name,
      sub_type: group.sub_type,
      male_premium_40,
      female_premium_40,
      declared_rate,
      business_fee,
      features
    });
  });

  console.log(`[*] Grouped into ${records.length} unique products. Clearing old records...`);

  const { error: deleteError } = await supabase
    .from('variable_products')
    .delete()
    .neq('company', 'DELETE_NONE');

  if (deleteError) {
    console.error("[-] Error clearing variable_products table:", deleteError);
    process.exit(1);
  }
  
  console.log("[+] Table cleared. Uploading new records...");

  const batchSize = 50;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('variable_products')
      .insert(batch);

    if (insertError) {
      console.error(`[-] Failed to insert batch ${i / batchSize + 1}:`, insertError);
      process.exit(1);
    }
    console.log(`  [+] Uploaded batch ${i / batchSize + 1} (${batch.length} products)`);
  }

  console.log("[+] SUCCESS! All variable/term products uploaded to Supabase.");
}

run().catch((err) => {
  console.error("[-] Execution failed:", err);
  process.exit(1);
});
