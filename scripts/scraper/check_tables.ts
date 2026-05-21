
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function listTables() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('[*] Querying tables from information_schema...');
  
  const { data, error } = await supabase
    .rpc('get_tables'); // This might not work if RPC is not defined

  if (error) {
    // Try raw SQL via REST if get_tables doesn't exist? No, usually not possible.
    // Let's try to just select from suspected tables.
    const tables = ['insurance_products', 'insurance_rates', 'surgery', 'hospitalization', 'surgery_hospital'];
    for (const table of tables) {
      const { count, error: tableError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (tableError) {
        console.log(`[-] Table '${table}' does not exist or error: ${tableError.message}`);
      } else {
        console.log(`[OK] Table '${table}' exists with ${count} rows.`);
      }
    }
  } else {
    console.log(data);
  }
}

listTables();
