import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// We will test using the Anon Key to simulate what the browser client does!
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function run() {
  const supabaseAnon = createClient(supabaseUrl!, anonKey!);
  const supabaseService = createClient(supabaseUrl!, serviceKey!);

  const plannerId = '99999999-9999-4999-b999-999999999999';

  console.log("1. Testing update using Service Role Key...");
  const { data: sData, error: sErr } = await supabaseService
    .from('planners')
    .update({ email: 'service_test@rebalance.com' })
    .eq('id', plannerId)
    .select();
  if (sErr) {
    console.error("Service key update failed:", sErr);
  } else {
    console.log("Service key update succeeded! Updated record:", sData);
  }

  console.log("\n2. Testing update using Anon Key...");
  const { data: aData, error: aErr } = await supabaseAnon
    .from('planners')
    .update({ email: 'anon_test@rebalance.com' })
    .eq('id', plannerId)
    .select();
  if (aErr) {
    console.error("Anon key update failed:", aErr);
  } else {
    console.log("Anon key update succeeded! Updated record:", aData);
  }
}

run();
