import { createClient } from '../src/utils/supabase/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient();

async function main() {
  const { data, error } = await supabase
    .from('golf_insurance_rates')
    .select('product_name')
    .limit(100);

  console.log('Golf rates products:', data ? Array.from(new Set(data.map((r: any) => r.product_name))) : [], 'Error:', error);
}

main();
