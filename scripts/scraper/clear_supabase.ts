import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function clearSupabase() {
  console.log('[*] Connecting to Supabase to CLEAR all data...');
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for deletion
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('[*] Deleting all records from insurance_rates...');
  const { error: rateError } = await supabase
    .from('insurance_rates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything

  if (rateError) {
    console.error('[-] Error clearing insurance_rates:', rateError.message);
  } else {
    console.log('[OK] insurance_rates table cleared.');
  }

  console.log('[*] Deleting all records from insurance_products...');
  const { error: productError } = await supabase
    .from('insurance_products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (productError) {
    console.error('[-] Error clearing insurance_products:', productError.message);
  } else {
    console.log('[OK] insurance_products table cleared.');
  }
}

clearSupabase();
