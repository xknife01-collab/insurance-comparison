import { createClient } from '../src/utils/supabase/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('accident_products')
    .select('*');

  if (error) {
    console.error('Error querying Supabase:', error);
  } else {
    console.log(`Query successful. Found ${data?.length} rows.`);
    if (data && data.length > 0) {
      console.log('First 5 rows:');
      console.log(JSON.stringify(data.slice(0, 5), null, 2));
    }
  }
}

run().catch(console.error);
