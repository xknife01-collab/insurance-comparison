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
  const clean = val.replace(/,/g, '').replace(/원/g, '').replace(/%/g, '').replace(/\s/g, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

async function run() {
  const csvPath = path.resolve(process.cwd(), 'insurance_data', '1_guaranteed', 'accident', 'extracted_data_combined.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`[-] Combined CSV file not found at: ${csvPath}`);
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
  const maleIdx = headers.indexOf("기준보험료");
  const femaleIdx = headers.indexOf("가입보험료");

  console.log(`[*] Loaded CSV: ${dataRows.length} rows.`);

  const recordsMap = new Map<string, { company_name: string; product_name: string; base_premium: number }>();

  for (const row of dataRows) {
    const company = row[companyIdx] || "";
    const product = row[productIdx] || "";
    const malePremium = cleanNumeric(row[maleIdx] || "");
    const femalePremium = cleanNumeric(row[femaleIdx] || "");

    const premium = malePremium > 0 ? malePremium : femalePremium;

    // Filter out rows under 5,000 KRW
    if (premium < 5000) {
      continue;
    }

    const key = `${company}||${product}`;
    if (!recordsMap.has(key)) {
      recordsMap.set(key, {
        company_name: company,
        product_name: product,
        base_premium: premium
      });
    } else {
      // Keep the lowest premium if duplicate
      const existing = recordsMap.get(key)!;
      if (premium < existing.base_premium) {
        existing.base_premium = premium;
      }
    }
  }

  const records = Array.from(recordsMap.values());
  console.log(`[+] Filtered and unique records (>= 5,000 KRW): ${records.length}`);

  console.log("[*] Clearing public.accident_products table...");
  const { error: deleteError } = await supabase
    .from('accident_products')
    .delete()
    .neq('company_name', 'DELETE_NONE');

  if (deleteError) {
    console.error("[-] Error clearing table:", deleteError.message);
    console.error("    Please verify that you have run the table creation SQL in the Supabase SQL Editor first!");
    process.exit(1);
  }
  console.log("[+] Table cleared.");

  // Insert records
  console.log(`[*] Uploading ${records.length} records to Supabase...`);
  const { error: insertError } = await supabase
    .from('accident_products')
    .insert(records);

  if (insertError) {
    console.error("[-] Upload failed:", insertError.message);
    process.exit(1);
  }

  console.log(`[+] SUCCESS! Successfully uploaded ${records.length} accident products to Supabase.`);
}

run();
