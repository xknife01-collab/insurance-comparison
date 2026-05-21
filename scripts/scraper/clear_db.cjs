
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function clear() {
  console.log("[*] Clearing database tables...");
  
  const { error: err1 } = await supabase.from('insurance_rates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (err1) console.error("Rates clear error:", err1);
  
  const { error: err2 } = await supabase.from('insurance_products').delete().neq('product_code', 'EMPTY_CODE');
  if (err2) console.error("Products clear error:", err2);

  console.log("[+] Database cleared.");
}

clear();
