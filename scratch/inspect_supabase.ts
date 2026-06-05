import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('variable_products')
    .select('company, product_name, sub_type, male_premium_40, female_premium_40')
    .eq('sub_type', 'term_pure')
    .order('male_premium_40', { ascending: true })
    .limit(20);

  if (error) {
    console.error("[-] Error querying Supabase:", error);
    return;
  }

  console.log("Top 20 pure term products in Supabase:");
  data.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.company}] ${p.product_name} | Male(40): ${p.male_premium_40?.toLocaleString()}원 | Female(40): ${p.female_premium_40?.toLocaleString()}원`);
  });
}

check();
