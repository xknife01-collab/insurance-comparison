import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("URL:", process.env.VITE_SUPABASE_URL);
console.log("ANON_KEY:", process.env.VITE_SUPABASE_ANON_KEY ? "EXISTS" : "MISSING");

async function run() {
  const { fetchDementiaPremium } = await import('../src/lib/insurance/dementia/dementiaLoader');

  const mockAnalysis: any = {
    age: 44,
    gender: 'M',
    selectedCategory: 'dementia',
    healthStatus: 'simple',
    caregiving: {
      dementiaDiagnosis: 30000000,
      monthlyAllowance: 500000,
      preferredService: 'home',
      hasProxyClaim: true,
      hasDementiaHistory: false,
      hasLtcGrade: false
    },
    cancer: { currentAmount: 0, targetAmount: 0 },
    cerebrovascular: { currentAmount: 0, targetAmount: 0 },
    cardiovascular: { currentAmount: 0, targetAmount: 0 },
    surgery: { currentAmount: 0, targetAmount: 0 },
    postDisability: { currentAmount: 0, targetAmount: 0 },
    paymentExemption: 'standard',
    monthlyPremium: 0
  };

  console.log("Running fetchDementiaPremium...");
  const result = await fetchDementiaPremium(mockAnalysis);
  
  if (result) {
    console.log("\nMAIN RECOMMENDATION:");
    console.log(`Product: [${result.companyName}] ${result.productName}`);
    console.log(`Premium: ${result.premium.toLocaleString()} KRW`);
    
    console.log("\nALL OPTIONS:");
    const sortedOptions = [...result._allOptions].sort((a, b) => a.premium - b.premium);
    sortedOptions.forEach((opt: any, idx: number) => {
      console.log(`${String(idx + 1).padStart(3, '0')} | ${opt.companyName.padEnd(8)} | ${opt.productName.padEnd(50)} | Premium: ${opt.premium.toLocaleString().padStart(9)} KRW | Riders: ${opt.ridersCount}`);
    });
  } else {
    console.log("No results returned.");
  }
}

run().catch(err => {
  console.error("Error running diagnosis script:", err);
});
