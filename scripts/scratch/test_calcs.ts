import path from 'path';
import dotenv from 'dotenv';

// Load env variables first
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runTest() {
  // Dynamically import to ensure env vars are loaded before supabase client is created
  const { fetchVariablePremium } = await import('../../src/lib/insurance/variable/variableLoader');
  
  const mockAnalysis: any = {
    age: 44,
    gender: 'M',
    variable: {
      subType: 'term',
      monthlyPremium: 150000,
      paymentPeriod: 10,
      investmentStyle: 'balanced',
      equityRatio: 50,
      isAnnuityConversion: false,
      deathBenefit: 100000000,
      coveragePeriod: 70,
      isHealthyDiscount: false
    }
  };
  
  const result = await fetchVariablePremium(mockAnalysis);
  console.log("=== CALCULATED RESULTS FOR AGE 44, 1.0억원 ===");
  result._allOptions.forEach((opt: any, idx: number) => {
    console.log(`${idx + 1}. ${opt.companyName} | ${opt.productName} | ${opt.premium.toLocaleString()}원`);
  });
}

runTest();
