import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("[*] Fetching from caregiving_insurance_plans via API...");
  const { data, error, count } = await supabase
    .from('caregiving_insurance_plans')
    .select('*', { count: 'exact' });

  if (error) {
    console.error("[-] Error fetching from caregiving_insurance_plans:", error.message);
  } else {
    console.log(`[+] Total rows in caregiving_insurance_plans: ${count}`);
    if (data && data.length > 0) {
      console.log("[+] First 3 rows:");
      console.log(JSON.stringify(data.slice(0, 3), null, 2));
    } else {
      console.log("[-] The table is EMPTY.");
    }
  }
}

run();
