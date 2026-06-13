import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function check() {
  const supabase = createClient(supabaseUrl!, supabaseKey!);
  const { data, error } = await supabase
    .from('variable_products')
    .select('*')
    .eq('company', '하나생명');

  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  console.log("Hana Life Products:");
  for (const item of data || []) {
    console.log(`- Product: ${item.product_name} | Subtype: ${item.sub_type}`);
    console.log(`  Male Prem: ${item.male_premium_40} | Female Prem: ${item.female_premium_40}`);
  }
}

check().catch(console.error);
