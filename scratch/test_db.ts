import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Inject to process.env so client can read it
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function run() {
  // Dynamically import the client after env vars are set
  const { createClient } = await import('../src/utils/supabase/client');
  const client = createClient();
  const { data, error } = await client.from('accident_products').select('company_name');
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Unique companies in live DB:', Array.from(new Set(data?.map(d => d.company_name))));
  }
}

run();
