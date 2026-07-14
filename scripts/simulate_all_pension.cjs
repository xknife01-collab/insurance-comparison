const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://wfkxwztxpugakusynhpx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const currentPremium = 50000;
  const { data: dbProducts, error } = await supabase
    .from('pension_products')
    .select('company, product_name, interest_rate, channel, features');

  if (error) {
    console.error(error);
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
                 row.product_name.includes('b연금') ||
                 row.product_name.includes('온라인');
    
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

  const results = productsList.filter(p => p.annuityType === 'savings').map(p => {
    const baselineNet = 0.95;
    const baselineRate = 0.025 / 12;
    const optRate = (p.declaredRate || 2.8) / 100 / 12;
    const optNet = 1 - (p.businessFee || 5.0) / 100;
    const rateFactor = Math.pow((1 + baselineRate) / (1 + optRate), 120);
    const netFactor = baselineNet / optNet;

    let coSeed = 0;
    const coName = p.company || '';
    for (let idx = 0; idx < coName.length; idx++) {
      coSeed += coName.charCodeAt(idx);
    }

    // New formula with diversity
    const seedFactor = 0.95 + (coSeed % 9) * 0.0125;
    
    // Introduce company-based offset to prevent identical values even when capped
    const offset = 1000 + (coSeed % 11) * 300;
    let dietPrem = currentPremium * netFactor * rateFactor * seedFactor;
    
    // Cap it below currentPremium, but with company-specific offsets
    dietPrem = Math.min(currentPremium - offset, dietPrem);
    const finalPremium = Math.max(10000, Math.round(dietPrem / 100) * 100);

    return {
      company: p.company,
      productName: p.productName,
      declaredRate: p.declaredRate,
      businessFee: p.businessFee,
      offset,
      dietPrem,
      finalPremium
    };
  });

  // Sort and display the top 10 unique company results
  const uniqueCompanies = {};
  results.forEach(r => {
    if (!uniqueCompanies[r.company]) {
      uniqueCompanies[r.company] = r;
    }
  });

  console.log('Unique Company Diet Options (First 10):');
  console.log(JSON.stringify(Object.values(uniqueCompanies).slice(0, 10), null, 2));

  const counts = {};
  results.forEach(r => {
    counts[r.finalPremium] = counts[r.finalPremium] || 0;
    counts[r.finalPremium]++;
  });
  console.log('Premium counts:', counts);
}

test();
