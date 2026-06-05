import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Inject to process.env explicitly for SSR client
if (!process.env.VITE_SUPABASE_URL && process.env.SUPABASE_URL) {
  process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL;
}
if (!process.env.VITE_SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY) {
  process.env.VITE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
}

async function test() {
  const { fetchChildPremium } = await import('../src/lib/insurance/child/childLoader');
  // Let's mock a 2026-born child (age 0), male, 30-year maturity, majorDisease focus
  const mockAnalysis: any = {
    age: 0,
    gender: 'M',
    child: {
      targetAgeGroup: 'child',
      maturity: 30,
      focusArea: 'majorDisease',
      hasPrenatalRider: false
    }
  };

  const result = await fetchChildPremium(mockAnalysis);
  if (result && result._allOptions) {
    console.log("=== Premium Calculations Breakdown (Age 0, Male, 30Y, Major Disease Focus) ===");
    result._allOptions.forEach((opt: any, index: number) => {
      console.log(`${index + 1}. ${opt.companyName} - ${opt.productName}`);
      console.log(`   Category: ${opt.category}`);
      console.log(`   Calculated Premium: ${opt.premium} 원`);
    });
  } else {
    console.log("No results or fetch failed.");
  }
}

test();
