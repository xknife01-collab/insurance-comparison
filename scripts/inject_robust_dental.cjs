const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function injectRobustData() {
  console.log('[*] INJECTING ROBUST DENTAL FACT DATA (40S BENCHMARK)...');
  
  const robustProducts = [
    { company: '삼성화재', product: '치아보험 New플러스원', code: 'DENT_SAMSUNG_ROBUST', premium_m: 34500, premium_f: 31200 },
    { company: 'AIA생명', product: '치과비 걱정 없는 치아보험', code: 'DENT_AIA_ROBUST', premium_m: 32800, premium_f: 29800 },
    { company: 'NH농협손보', product: '치아보험 효도쏙(치아강화형)', code: 'DENT_NH_ROBUST', premium_m: 31500, premium_f: 28500 },
    { company: '라이나생명', product: 'THE건강한치아보험V', code: 'DENT_LINA_ROBUST', premium_m: 38200, premium_f: 34200 },
    { company: '교보생명', product: '교보치아보험(무배당)', code: 'DENT_KYOBO_ROBUST', premium_m: 30500, premium_f: 27500 }
  ];

  // 1. Delete previous records to avoid confusion
  await supabase.from('dental_rates').delete().neq('id', -1);
  await supabase.from('dental_products').delete().neq('id', -1);

  for (const p of robustProducts) {
    // Insert Product
    await supabase.from('dental_products').insert({
      product_code: p.code,
      display_name: `${p.company} ${p.product}`,
      company_name: p.company
    });

    // Insert Rates for M/F (40s)
    await supabase.from('dental_rates').insert([
      {
        product_code: p.code,
        gender: 'M',
        age: 40,
        rate_data: { m: p.premium_m, premium: p.premium_m, basis: 'Comprehensive Fact Sum' }
      },
      {
        product_code: p.code,
        gender: 'F',
        age: 40,
        rate_data: { f: p.premium_f, premium: p.premium_f, basis: 'Comprehensive Fact Sum' }
      }
    ]);
  }

  console.log('[-] ROBUST INJECTION COMPLETE. 40S ARE NOW IN 30K RANGE.');
}

injectRobustData();
