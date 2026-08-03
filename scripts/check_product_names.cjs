
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase
    .from('insurance_products')
    .select('display_name, category')
    .ilike('display_name', '%실손%')
    .limit(30);
  
  if (error) console.error(error);
  else console.log(data.map(p => p.display_name).join('\n'));
}

check();
