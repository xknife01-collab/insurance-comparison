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
    .in('sub_type', ['term_pure', 'term_ceo', 'variable_term'])
    .order('id');
    
  if (error) {
    console.error("Error fetching variable products:", error);
    process.exit(1);
  }
  
  console.log(`Total term/ceo/variable_term products in DB: ${data.length}`);
  data.forEach((r) => {
    console.log(`ID: ${r.id} | Company: ${r.company} | Name: ${r.product_name} | SubType: ${r.sub_type} | Male40: ${r.male_premium_40} | Female40: ${r.female_premium_40} | Rate: ${r.declared_rate}`);
  });
}

check();
