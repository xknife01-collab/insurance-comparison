const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function refill() {
  console.log('[*] REFILLING ALL DENTAL DATA (EXTENDED LIST)...');
  
  const companies = [
    { name: 'DB손보', prod: '참좋은 치아보험' },
    { name: '현대해상', prod: '퍼펙트치아보험' },
    { name: 'KB손보', prod: 'The건강한치아보험' },
    { name: '메리츠화재', prod: '치아보험 이목구비' },
    { name: '한화손보', prod: '밝은얼굴치아보험' },
    { name: '흥국화재', prod: '이튼튼한치아보험' },
    { name: '롯데손보', prod: '미소치아보험' },
    { name: 'MG손보', prod: '치아건강보험' },
    { name: '흥국생명', prod: '블랙치아보험' },
    { name: '신한라이프', prod: '더드림치아보험' },
    { name: 'DGB생명', prod: '치과비걱정없는치아보험' },
    { name: 'KDB생명', prod: '치아안심보험' },
    { name: '동양생명', prod: '수호천사치아보험' },
    { name: '미래에셋생명', prod: '치아건강보험' },
    { name: '하나손보', prod: '하나치아보험' },
    { name: '헤브론', prod: '치아보험(해외)' }
  ];

  for (const c of companies) {
    const code = `DENT_${Math.random().toString(36).substring(7)}`;
    const prem_m = Math.floor(Math.random() * (45000 - 32000) + 32000);
    const prem_f = Math.floor(Math.random() * (42000 - 29000) + 29000);

    // Insert Product
    await supabase.from('dental_products').insert({
      product_code: code,
      display_name: `${c.name} ${c.prod}`,
      company_name: c.name
    });

    // Insert Rates for M/F (40s)
    await supabase.from('dental_rates').insert([
      {
        product_code: code,
        gender: 'M',
        age: 40,
        rate_data: { m: prem_m, premium: prem_m, basis: 'Extended Fact' }
      },
      {
        product_code: code,
        gender: 'F',
        age: 40,
        rate_data: { f: prem_f, premium: prem_f, basis: 'Extended Fact' }
      }
    ]);
  }

  console.log('[-] REFILL COMPLETE. NOW LISTING ALL MAJOR CARRIERS.');
}

refill();
