import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: env vars missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspect() {
  console.log('Inspecting agencies table...');
  const { data: agencyData, error: agencyErr } = await supabase.from('agencies').select('*').limit(1);
  if (agencyErr) {
    console.error('agencies error:', agencyErr);
  } else {
    console.log('agencies columns:', agencyData.length > 0 ? Object.keys(agencyData[0]) : 'No rows');
  }

  console.log('Inspecting planners table...');
  const { data: plannerData, error: plannerErr } = await supabase.from('planners').select('*').limit(1);
  if (plannerErr) {
    console.error('planners error:', plannerErr);
  } else {
    console.log('planners columns:', plannerData.length > 0 ? Object.keys(plannerData[0]) : 'No rows');
  }

  console.log('Inspecting customer_leads table...');
  const { data: leadData, error: leadErr } = await supabase.from('customer_leads').select('*').limit(1);
  if (leadErr) {
    console.error('customer_leads error:', leadErr);
  } else {
    console.log('customer_leads columns:', leadData.length > 0 ? Object.keys(leadData[0]) : 'No rows');
  }
}

inspect().catch(console.error);
