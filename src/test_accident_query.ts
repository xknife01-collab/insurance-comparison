import { getMockSupabaseClient } from '../src/utils/supabase/mockClient';

async function test() {
  const supabase = getMockSupabaseClient();
  const { data, error } = await supabase
    .from('accident_products')
    .select('company_name, product_name, base_premium');
  
  console.log('Error:', error);
  console.log('Data length:', data?.length);
  if (data && data.length > 0) {
    console.log('First 5 records:', data.slice(0, 5));
  }
}

test().catch(console.error);
