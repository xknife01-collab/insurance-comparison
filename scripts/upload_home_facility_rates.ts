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

function cleanPremium(val: string): number {
  if (!val) return 0;
  const clean = val.replace(/,/g, '').replace(/원/g, '').replace(/\s/g, '').trim();
  const match = clean.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parsePaymentPeriod(rowText: string): string {
  // Check for 일시납
  if (/(?:예시|기준|공시).*?(일시납)/.test(rowText) || /일시납/.test(rowText)) {
    return "일시납";
  }
  // Check for X년납
  const yearsMatch = rowText.match(/(\d+)\s*년\s*납/);
  if (yearsMatch) {
    return `${yearsMatch[1]}년납`;
  }
  for (const years of [20, 10, 30, 15, 5, 7]) {
    if (rowText.includes(`${years}년`)) {
      return `${years}년납`;
    }
  }
  return "20년납";
}

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '2_care', 'home_facility', 'extracted_data.csv');
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
  const insuredIdx = headers.indexOf("가입금액");
  const maleIdx = headers.indexOf("기준보험료");
  const femaleIdx = headers.indexOf("가입보험료");
  const rateIdx = headers.indexOf("적용이율");
  const sourceIdx = headers.indexOf("source_file");

  console.log(`[*] Loaded CSV: ${dataRows.length} rows.`);

  const records = dataRows.map((row) => {
    const company = row[companyIdx] || "";
    const product = row[productIdx] || "";
    const division = row[divisionIdx] || "";
    const benefit = row[benefitIdx] || "";
    const reason = row[reasonIdx] || "";
    const amount = row[amountIdx] || "";
    const insured = row[insuredIdx] || "";
    
    const pm = cleanPremium(row[maleIdx] || "");
    const pf = cleanPremium(row[femaleIdx] || "");
    
    // Find applied rate
    let appliedRate = row[rateIdx] || "";
    if (!appliedRate) {
      // Find from raw columns in the row
      for (let i = 16; i < row.length; i++) {
        const val = row[i];
        if (val && val.includes('%') && /\d+\.?\d*\s*%/.test(val)) {
          appliedRate = val.trim();
          break;
        }
      }
    }

    const rowText = row.join(" ");
    const payPeriod = parsePaymentPeriod(rowText);
    const sourceFile = row[sourceIdx] || "";

    return {
      company_name: company,
      product_name: product,
      division: division,
      benefit_name: benefit,
      benefit_reason: reason,
      benefit_amount: amount,
      insured_amount: insured,
      premium_male: pm,
      premium_female: pf,
      applied_rate: appliedRate,
      payment_type: `월납(${payPeriod})`,
      source_file: sourceFile
    };
  });

  console.log("[*] Clearing public.insurance_home_facility_rates table...");
  const { error: deleteError } = await supabase
    .from('insurance_home_facility_rates')
    .delete()
    .neq('id', -1);

  if (deleteError) {
    console.error("[-] Error clearing table:", deleteError.message);
    process.exit(1);
  }
  console.log("[+] Table cleared.");

  console.log(`[*] Uploading ${records.length} records...`);
  const { error: insertError } = await supabase
    .from('insurance_home_facility_rates')
    .insert(records);

  if (insertError) {
    console.error("[-] Upload failed:", insertError.message);
    process.exit(1);
  }

  console.log("[+] SUCCESS! All home/facility care rates successfully uploaded to Supabase.");
}

run();
