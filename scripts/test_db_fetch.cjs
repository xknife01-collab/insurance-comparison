
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testFetch() {
  const age = 40;
  const gender = 'M';
  const preExistingType = '3.5.5';
  
  console.log(`[*] Testing UBJ Fetch - Age: ${age}, Gender: ${gender}, Type: ${preExistingType}`);

  // 1. Check Table Exists and has rows
  const { count, error: countErr } = await supabase
    .from('insurance_yu_byung_ja')
    .select('*', { count: 'exact', head: true });
    
  console.log(`[*] Total rows in table: ${count}`);
  if (countErr) console.error(`[!] Count Error: ${countErr.message}`);

  // 2. Try exact match query
  const { data, error } = await supabase
    .from('insurance_yu_byung_ja')
    .select('*')
    .eq('review_type', preExistingType);

  console.log(`[*] Rows with type ${preExistingType}: ${data?.length || 0}`);
  if (error) console.error(`[!] Query Error: ${error.message}`);

  if (data && data.length > 0) {
    const p = data[0];
    const genderKey = gender;
    const ageStr = String(age);
    const rateKey = `premium_${genderKey}_${ageStr}`;
    
    console.log(`[*] Sample Product: ${p.product_name}`);
    console.log(`[*] Rate Keys in sample: ${Object.keys(p.rates).slice(0, 5)}`);
    console.log(`[*] Looking for key: ${rateKey}`);
    console.log(`[*] Found Value: ${p.rates[rateKey]}`);
  } else {
    // 3. Try broader query
    const { data: fallback } = await supabase
        .from('insurance_yu_byung_ja')
        .select('*')
        .limit(5);
    console.log(`[*] Fallback data found: ${fallback?.length || 0}`);
    if (fallback && fallback.length > 0) {
        console.log(`[*] Sample review_type in DB: ${fallback[0].review_type}`);
    }
  }
}

testFetch();
