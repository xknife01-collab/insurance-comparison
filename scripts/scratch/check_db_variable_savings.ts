import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('variable_products')
    .select('*')
    .eq('sub_type', 'variable_saving')
    .order('id');
    
  if (error) {
    console.error("Error fetching variable saving products:", error);
    process.exit(1);
  }
  
  console.log(`Total variable saving products in DB: ${data.length}`);
  data.slice(0, 20).forEach((r) => {
    console.log(`ID: ${r.id} | Company: ${r.company} | Name: ${r.product_name} | Rate: ${r.declared_rate} | Fee: ${r.business_fee}`);
  });
}

check();
