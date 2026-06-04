const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found.");
  process.exit(1);
}

const s = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('--- DB SCAN FOR pension_products ---');
  try {
    const { data, count, error } = await s
      .from('pension_products')
      .select('*', { count: 'exact' });

    if (error) {
      console.error("[-] Error:", error.message);
      return;
    }

    console.log(`[+] Total rows: ${count}`);
    
    // Check product names with '저축'
    const { data: savingsData, error: savingsErr } = await s
      .from('pension_products')
      .select('company, product_name, interest_rate')
      .ilike('product_name', '%저축%');
      
    if (savingsErr) {
      console.error("[-] Savings Error:", savingsErr.message);
      return;
    }
    
    console.log(`[+] Total savings rows: ${savingsData.length}`);
    const uniq = new Set(savingsData.map(d => `${d.company} | ${d.product_name}`));
    console.log(`[+] Unique savings products: ${uniq.size}`);
    console.log('[+] Samples:');
    Array.from(uniq).slice(0, 15).forEach(p => console.log(`  - ${p}`));
  } catch (e) {
    console.error("[-] Catch error:", e);
  }
}
test();
