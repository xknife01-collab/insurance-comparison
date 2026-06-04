import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

async function run() {
  const types = ['term_pure', 'term_ceo', 'variable_term', 'variable_saving'];
  console.log("=== BREAKDOWN OF PRODUCT SUBTYPES IN SUPABASE ===");
  for (const t of types) {
    const { data, count, error } = await supabase
      .from('variable_products')
      .select('*', { count: 'exact' })
      .eq('sub_type', t);
      
    if (error) {
      console.error(`Error for ${t}:`, error);
      continue;
    }
    console.log(`Subtype: ${t} | Total unique products: ${count}`);
    // Print first 3 products
    if (data) {
      data.slice(0, 3).forEach(p => {
        console.log(`  - [${p.company}] ${p.product_name} (Premium Male40: ${p.male_premium_40}, Declared Rate: ${p.declared_rate}%)`);
      });
    }
  }
}

run();
