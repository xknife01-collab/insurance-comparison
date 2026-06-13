import dotenv from 'dotenv';
import path from 'path';
const resultEnv = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log("dotenv config result:", resultEnv.error ? "Failed" : "Success");
console.log("VITE_SUPABASE_URL in env:", process.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY in env:", process.env.VITE_SUPABASE_ANON_KEY ? "Present" : "Missing");

import { InsuranceAnalysis } from '../src/types/insurance';

async function run() {
  const { fetchDementiaPremium } = await import('../src/lib/insurance/dementia/dementiaLoader');
  const analysis: InsuranceAnalysis = {
    age: 40,
    gender: 'M',
    selectedCategory: '치매 간병보험',
    monthlyPremium: 45000,
    hasDiseaseHistory: false,
    diseaseHistoryDetail: '',
    selectedPeriod: '20년납 100세만기',
    caregiving: {
      dementiaDiagnosis: 30000000, // 3,000만원
      monthlyAllowance: 500000, // 50만원
      preferredService: 'home',
      hasProxyClaim: true,
      hasDementiaHistory: false,
      hasLtcGrade: false
    }
  } as any;

  console.log("Running fetchDementiaPremium for 40-year-old male...");
  const result = await fetchDementiaPremium(analysis);
  console.log("Loader Result:", JSON.stringify(result, null, 2));
}

run().catch(console.error);
