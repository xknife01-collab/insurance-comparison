const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wfkxwztxpugakusynhpx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_tables'); // Or try querying information_schema
  if (error) {
    // If rpc fails, run a query using raw sql if possible, or try querying table names by executing query on public schema.
    // Wait, Supabase client doesn't allow raw SQL queries directly unless we use an rpc.
    // Let's see if we can query info by reading from some known tables or info.
    console.error('RPC Error:', error);
  } else {
    console.log('Tables:', data);
  }
}
run();
