import { createClient } from '../src/utils/supabase/client';

async function run() {
  const supabase = createClient();
  const { data, error } = await supabase.from('insurance_dementia_rates').select('*').limit(1);
  if (error) {
    console.error(error);
    return;
  }
  console.log("DB Columns & First Row Example:");
  console.log(data);
}
run();
