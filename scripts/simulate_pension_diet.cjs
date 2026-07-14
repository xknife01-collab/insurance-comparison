const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wfkxwztxpugakusynhpx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Let's copy fetchAnnuityPremium logic or just import it if possible, but importing TS from JS is hard.
// Let's just simulate the exact logic.
async function simulate() {
  const opts = {
    annuityType: 'savings',
    monthlyPremium: 50000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
  };

  const selectedType = 'savings';
  const currentPremium = 50000;

  // Fetch real pension products
  const { data: dbProducts, error } = await supabase
    .from('pension_products')
    .select('company, product_name, interest_rate, channel, features');

  if (error) {
    console.error('Error:', error);
    return;
  }

  let productsList = [];
  const seen = new Set();
  dbProducts.forEach(row => {
    const key = `${row.company}__${row.product_name}`;
    if (seen.has(key)) return;
    seen.add(key);

    let rate = 2.50;
    if (row.interest_rate) {
      const parsed = parseFloat(row.interest_rate.replace(/%/g, '').trim());
      if (!isNaN(parsed)) rate = parsed;
    }

    const isCM = row.channel?.includes('CM') || 
                 row.product_name.includes('다이렉트') || 
                 row.product_name.includes('인터넷') || 
                 row.product_name.includes('e-') || 
                 row.product_name.includes('라플') || 
                 row.product_name.includes('b연금');
    
    const businessFee = isCM ? 3.5 : (row.company.includes('생명') ? 5.0 : 4.5);
    const isSavings = row.product_name.includes('연금저축');
    const annuityType = isSavings ? 'savings' : 'insurance';

    productsList.push({
      company: row.company,
      productName: row.product_name,
      annuityType: annuityType,
      declaredRate: rate,
      guaranteedRate: rate * 0.3,
      businessFee: businessFee,
      features: row.features || ""
    });
  });

  const results = productsList.filter(p => p.annuityType === selectedType).map(p => {
    return {
      premium: opts.monthlyPremium,
      riskPremium: Math.round(opts.monthlyPremium * (p.businessFee / 100)),
      savingsPremium: Math.round(opts.monthlyPremium * (1 - p.businessFee / 100)),
      productName: p.productName,
      companyName: p.company,
      declaredRate: p.declaredRate,
      businessFee: p.businessFee,
      features: p.features || ""
    };
  });

  // Now, calculate diet options like in categoryMatcher.ts:
  const pool = [...results].sort((a, b) => (b.declaredRate || 0) - (a.declaredRate || 0));

  const dietOptions = pool.map(opt => {
    let finalPremium = opt.premium;
    let features = `동일 보장 유지`;
    
    const baselineNet = 0.95;
    const baselineRate = 0.025 / 12;
    const optRate = (opt.declaredRate || 2.8) / 100 / 12;
    const optNet = 1 - (opt.businessFee || 5.0) / 100;
    const rateFactor = Math.pow((1 + baselineRate) / (1 + optRate), 120);
    const netFactor = baselineNet / optNet;

    // 회사별 고유 편차 부여 (동일군 내 가격 분산화)
    let coSeed = 0;
    const coName = opt.companyName || opt.company || '';
    for (let idx = 0; idx < coName.length; idx++) {
      coSeed += coName.charCodeAt(idx);
    }
    const seedFactor = 0.95 + (coSeed % 9) * 0.0125; // 0.95 ~ 1.05 범위

    let dietPrem = currentPremium * netFactor * rateFactor * seedFactor;
    dietPrem = Math.min(currentPremium - 1200, dietPrem);
    finalPremium = Math.max(10000, Math.round(dietPrem / 100) * 100);
    
    return {
      companyName: opt.companyName,
      productName: opt.productName,
      declaredRate: opt.declaredRate,
      businessFee: opt.businessFee,
      coSeed,
      seedFactor,
      dietPrem,
      finalPremium,
    };
  });

  console.log('Results length:', results.length);
  console.log('Diet Options:', JSON.stringify(dietOptions.slice(0, 10), null, 2));
}

simulate();
