import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environmental variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const JSON_PATH = path.resolve(process.cwd(), 'scripts/scratch/credit_plans.json');

async function run() {
  console.log(`[*] Initializing Supabase client pointing to: ${supabaseUrl}`);
  
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`[-] JSON file not found at: ${JSON_PATH}`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(JSON_PATH, 'utf-8');
  const records = JSON.parse(rawJson);
  console.log(`[+] Loaded ${records.length} records from JSON file.`);

  // 1. Clear old data from public.credit_insurance_plans
  console.log("[*] Clearing old records from credit_insurance_plans...");
  const { error: deleteError } = await supabase
    .from('credit_insurance_plans')
    .delete()
    .gt('id', 0);

  if (deleteError) {
    console.warn("[-] Warning while clearing table (it might be empty or permissions restricted):", deleteError.message);
  } else {
    console.log("[+] Table cleared successfully.");
  }

  // 2. Seeding records in batches of 30
  console.log("[*] Seeding records to Supabase...");
  const batchSize = 30;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('credit_insurance_plans')
      .insert(batch);

    if (insertError) {
      console.error(`[-] Error inserting batch ${i / batchSize + 1}:`, insertError.message);
      process.exit(1);
    }
    console.log(`  [+] Seeded batch ${i / batchSize + 1} (${batch.length} rows)`);
  }

  console.log("\n[+] Database seeding completed successfully!");
}

run();
