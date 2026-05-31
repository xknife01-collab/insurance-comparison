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

function cleanRate(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/%/g, '').replace(/\s/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '5_savings', 'whole_life', 'extracted_data.csv');
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
  const rateIdx = headers.indexOf("적용이율");

  console.log(`[*] Loaded Whole Life CSV: ${dataRows.length} rows.`);

  // Group by (company, product) to extract unique products
  const productGroups: { [key: string]: { company: string, product: string, rates: Set<number> } } = {};

  dataRows.forEach((row) => {
    const company = row[companyIdx] || "";
    const product = row[productIdx] || "";
    if (!company || !product) return;

    let rate = cleanRate(row[rateIdx] || "");
    if (rate === 0) {
      // Look for any percentage in raw columns representing a reasonable interest rate (< 10%)
      for (let i = 16; i < row.length; i++) {
        const val = row[i];
        if (val && val.includes('%') && /\d+\.?\d*\s*%/.test(val)) {
          const possibleRate = cleanRate(val);
          if (possibleRate > 0 && possibleRate < 10.0) {
            rate = possibleRate;
            break;
          }
        }
      }
    }

    const key = `${company}||${product}`;
    if (!productGroups[key]) {
      productGroups[key] = {
        company,
        product,
        rates: new Set()
      };
    }
    if (rate > 0) {
      productGroups[key].rates.add(rate);
    }
  });

  const getProductFeatures = (company: string, productName: string, rate: number): string => {
    const isCM = productName.includes('다이렉트') || 
                 productName.includes('인터넷') || 
                 productName.includes('e-') || 
                 productName.includes('온라인');

    const features: string[] = [];

    if (isCM) {
      features.push("인터넷 CM 전용 최저 수수료 적용");
    } else {
      features.push("오프라인 전담 밀착 케어 서비스");
    }

    if (rate > 0) {
      features.push(`적용이율 (${rate.toFixed(2)}%) 반영`);
    } else {
      features.push("표준 복리 이율 제공");
    }

    if (company.includes('삼성')) {
      features.push("자산 규모 1위 삼성생명의 높은 안정성");
    } else if (company.includes('한화')) {
      features.push("유연한 추가납입 및 납입유예 유동성 제공");
    } else if (company.includes('교보')) {
      features.push("자산관리 및 연금전환 특화 솔루션");
    } else {
      features.push("예금자보호법 및 해약환급 보장 안전망");
    }

    return features.join(" | ");
  };

  const records = Object.values(productGroups).map((g) => {
    const company = g.company;
    const product = g.product;
    
    // Determine refund type
    const isLow = product.includes('저해지') || 
                  product.includes('무해지') || 
                  product.includes('일부지급') || 
                  product.includes('미지급') || 
                  product.includes('적은') || 
                  product.includes('없는');
                  
    const refundType = isLow ? 'low' : 'standard';
    
    // Get max rate
    const ratesList = Array.from(g.rates);
    const maxRate = ratesList.length > 0 ? Math.max(...ratesList) : (isLow ? 3.10 : 2.85);
    
    // Determine business fee
    const businessFee = isLow ? 5.00 : 6.50;

    return {
      company: company,
      product_name: product,
      refund_type: refundType,
      declared_rate: maxRate,
      business_fee: businessFee,
      features: getProductFeatures(company, product, maxRate)
    };
  });

  console.log(`[*] Extracted ${records.length} unique whole life products.`);

  console.log("[*] Clearing public.whole_life_products table...");
  const { error: deleteError } = await supabase
    .from('whole_life_products')
    .delete()
    .neq('company', 'empty'); // Delete all

  if (deleteError) {
    console.error("[-] Error clearing table:", deleteError.message);
    process.exit(1);
  }
  console.log("[+] Table cleared.");

  console.log(`[*] Uploading ${records.length} records...`);
  const { error: insertError } = await supabase
    .from('whole_life_products')
    .insert(records);

  if (insertError) {
    console.error("[-] Upload failed:", insertError.message);
    process.exit(1);
  }

  console.log("[+] SUCCESS! All whole life products successfully uploaded to Supabase.");
}

run();
