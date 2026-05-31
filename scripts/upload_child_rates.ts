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

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '3_family', 'child', 'extracted_data.csv');
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
  const categoryIdx = headers.indexOf("category_target");

  console.log(`[*] Loaded Child CSV: ${dataRows.length} rows.`);

  const records = dataRows.map((row) => {
    let company = row[companyIdx] || "";
    let product = row[productIdx] || "";
    let division = row[divisionIdx] || "";
    let benefit = row[benefitIdx] || "";
    let reason = row[reasonIdx] || "";
    let amount = row[amountIdx] || "";
    let insured = row[insuredIdx] || "";
    let categoryTarget = categoryIdx >= 0 ? row[categoryIdx] : "";
    
    const pm = cleanPremium(row[maleIdx] || "");
    const pf = cleanPremium(row[femaleIdx] || "");
    
    // Find applied rate
    let appliedRate = row[rateIdx] || "";
    if (!appliedRate) {
      for (let i = 16; i < row.length; i++) {
        const val = row[i];
        if (val && val.includes('%') && /\d+\.?\d*\s*%/.test(val) && val.length < 15) {
          appliedRate = val.trim();
          break;
        }
      }
    }

    // Safe truncation to match PostgreSQL column definitions
    if (company.length > 100) company = company.substring(0, 100);
    if (product.length > 255) product = product.substring(0, 255);
    if (division.length > 100) division = division.substring(0, 100);
    if (benefit.length > 255) benefit = benefit.substring(0, 255);
    if (amount.length > 100) amount = amount.substring(0, 100);
    if (insured.length > 100) insured = insured.substring(0, 100);
    if (appliedRate.length > 50) appliedRate = appliedRate.substring(0, 50);

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
      category: categoryTarget || null,
      payment_type: "월납(주계약+특약종합)",
      source_file: sourceFile
    };
  });

  console.log("[*] Clearing public.insurance_child_rates table...");
  const { error: deleteError } = await supabase
    .from('insurance_child_rates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // using text/uuid safe delete query

  if (deleteError) {
    console.warn("[-] Error clearing table (it might not exist yet):", deleteError.message);
  } else {
    console.log("[+] Table cleared.");
  }

  console.log(`[*] Uploading ${records.length} child insurance records...`);
  const { error: insertError } = await supabase
    .from('insurance_child_rates')
    .insert(records);

  if (insertError) {
    console.error("[-] Upload failed:", insertError.message);
    process.exit(1);
  }

  console.log("[+] SUCCESS! All child insurance rates successfully uploaded to Supabase.");
}

run();
