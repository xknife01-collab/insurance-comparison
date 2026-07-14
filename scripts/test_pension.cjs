const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wfkxwztxpugakusynhpx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase
      .from('pension_products')
      .select('company, product_name, interest_rate, channel, features');
    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('Pension products count:', data.length);
      const rates = {};
      data.forEach(p => {
        rates[p.company] = rates[p.company] || [];
        rates[p.company].push(p.interest_rate);
      });
      console.log('Company interest rates summary:');
      for (const [co, rt] of Object.entries(rates)) {
        console.log(`- ${co}: ${rt.slice(0, 5).join(', ')} (total ${rt.length})`);
      }
    }
  } catch (err) {
    console.error('Failed:', err);
  }
}

test();
