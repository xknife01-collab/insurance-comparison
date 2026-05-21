
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const s = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const tables = ['insurance_products', 'insurance_rates', 'recommendation_plans', 'analysis_results', 'user_analysis', 'mock_plans', 'products', 'rates'];
  console.log('--- STARTING COMPREHENSIVE DB SCAN FOR NH/10715 ---');
  for (const t of tables) {
    try {
      const { data, count, error } = await s.from(t).select('*', { count: 'exact', head: false }).limit(20);
      if (!error && data) {
        const str = JSON.stringify(data);
        if (str.includes('NH') || str.includes('10715') || str.includes('Market')) {
            console.log(`[FOUND!!] Table ${t} contains the ghost data.`);
            console.log('Record Sample:', str.substring(0, 500));
        } else {
            console.log(`[CLEAN] Table ${t} checked.`);
        }
      }
    } catch (e) {}
  }
  console.log('--- SCAN FINISHED ---');
}
test();
