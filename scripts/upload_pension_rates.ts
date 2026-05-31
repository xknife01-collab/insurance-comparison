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

function cleanNumeric(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/,/g, '').replace(/원/g, '').replace(/%/g, '').replace(/USD/g, '').replace(/\s/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '5_savings', 'pension', 'extracted_data.csv');
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
  
  // Find column indices
  const companyIdx = headers.indexOf("보험회사");
  const productIdx = headers.indexOf("상품명");
  const divisionIdx = headers.indexOf("구분");
  const benefitIdx = headers.indexOf("담보명(급부명)");
  const reasonIdx = headers.indexOf("지급사유");
  const amountIdx = headers.indexOf("지급금액");
  const rateIdx = headers.indexOf("적용이율");
  const channelIdx = headers.indexOf("판매채널");
  const dateIdx = headers.indexOf("기준일자");
  const descIdx = headers.indexOf("상세안내");
  const contactIdx = headers.indexOf("연락처");
  const sourceIdx = headers.indexOf("source_file");

  console.log(`[*] Loaded CSV: ${dataRows.length} rows.`);

  const getProductFeatures = (company: string, productName: string, interestRateStr: string): string => {
    const isCM = productName.includes('다이렉트') || 
                 productName.includes('인터넷') || 
                 productName.includes('e-') || 
                 productName.includes('라플') || 
                 productName.includes('b연금') ||
                 productName.includes('온라인');

    const rate = parseFloat((interestRateStr || "").replace(/%/g, '').trim());
    const features: string[] = [];

    if (isCM) {
      features.push("인터넷 CM 전용 최저 수수료(사업비 3.5%)");
    } else {
      features.push("오프라인 대면 밀착 케어 서비스");
    }

    if (!isNaN(rate)) {
      if (rate >= 3.0) {
        features.push(`업계 최우수 공시이율 (${interestRateStr})`);
      } else if (rate >= 2.8) {
        features.push(`안정적인 고금리 이율 (${interestRateStr})`);
      } else {
        features.push(`안정 보장형 복리 이율 (${interestRateStr})`);
      }
    } else {
      features.push("표준 복리 이율 제공");
    }

    if (company.includes('삼성')) {
      features.push("자산 규모 1위 삼성금융 브랜드의 절대 안정성");
    } else if (company.includes('한화')) {
      features.push("자유로운 중도 인출 및 추가 납입 유연성");
    } else if (company.includes('교보')) {
      features.push("유니버셜 기능 결합 및 안정적 최저보증이율");
    } else if (company.includes('동양')) {
      features.push("연금 개시 전후 유연한 플랜 구성");
    } else if (company.includes('현대')) {
      features.push("고객 케어 및 다이렉트 편의성 제공");
    } else {
      features.push("예금자보호법 적용 대상 및 최저보증 안전망");
    }

    return features.join(" | ");
  };

  const records = dataRows.map((row) => {
    const company = row[companyIdx] || "";
    const product = row[productIdx] || "";
    const division = row[divisionIdx] || "";
    const benefit = row[benefitIdx] || "";
    const reason = row[reasonIdx] || ""; // 지급사유 = 해약환급금
    const amount = row[amountIdx] || ""; // 지급금액 = 환급률
 
    const surrenderVal = cleanNumeric(reason);
    const refundRate = cleanNumeric(amount);
     
    // Find applied rate
    let appliedRate = row[rateIdx] || "";
    if (!appliedRate) {
      for (let i = 16; i < row.length; i++) {
        const val = row[i];
        if (val && val.includes('%') && /\d+\.?\d*\s*%/.test(val)) {
          appliedRate = val.trim();
          break;
        }
      }
    }
 
    return {
      company: company,
      product_name: product,
      period: division,
      accum_premium: benefit,
      surrender_value: surrenderVal,
      refund_rate: refundRate,
      interest_rate: appliedRate,
      channel: row[channelIdx] || "",
      base_date: row[dateIdx] || "",
      description: row[descIdx] || "",
      contact: row[contactIdx] || "",
      source_file: row[sourceIdx] || "",
      features: getProductFeatures(company, product, appliedRate)
    };
  });

  console.log("[*] Clearing public.pension_products table...");
  const { error: deleteError } = await supabase
    .from('pension_products')
    .delete()
    .neq('id', -1);

  if (deleteError) {
    console.error("[-] Error clearing table:", deleteError.message);
    process.exit(1);
  }
  console.log("[+] Table cleared.");

  // Insert in batches of 500 rows to avoid request size limits
  const batchSize = 500;
  console.log(`[*] Uploading ${records.length} records in batches of ${batchSize}...`);
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('pension_products')
      .insert(batch);

    if (insertError) {
      console.error(`[-] Batch upload failed at index ${i}:`, insertError.message);
      process.exit(1);
    }
    console.log(`[+] Uploaded batch ${Math.floor(i / batchSize) + 1} (${i + batch.length}/${records.length})`);
  }

  console.log("[+] SUCCESS! All pension products successfully uploaded to Supabase.");
}

run();
