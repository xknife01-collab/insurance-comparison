import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wfkxwztxpugakusynhpx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Checking columns in agencies table...');
  try {
    const { data, error } = await supabase.from('agencies').select('id, name, subscription_tier, max_planner_limit').limit(1);
    if (error) {
      console.error('Error fetching columns:', error.message);
    } else {
      console.log('Columns exist! Data:', data);
    }
  } catch (err) {
    console.error('Failed to run query:', err);
  }
}

test();
