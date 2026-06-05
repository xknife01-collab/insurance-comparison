import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Environment vars missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('accident_products')
    .select('*')
    .order('base_premium', { ascending: true });

  if (error) {
    console.error("[-] Error:", error.message);
    process.exit(1);
  }

  console.log("=== DB accident_products (sorted by base_premium) ===");
  data?.forEach((row, i) => {
    console.log(`${i+1}. [${row.company_name}] ${row.product_name} -> base_premium: ${row.base_premium}`);
  });
}

run();
