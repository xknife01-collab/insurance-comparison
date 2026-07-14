import './preload_env';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('accident_products')
    .select('*');
  
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('Total Products:', data.length);
    const nullPremiums = data.filter(p => p.base_premium === null || p.base_premium === undefined);
    console.log('Products with null base_premium:', nullPremiums.length);
    if (nullPremiums.length > 0) {
      console.log('Sample null products:', nullPremiums.slice(0, 5));
    }
  }
}

run();
