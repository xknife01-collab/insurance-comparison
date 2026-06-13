import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("DEBUG ENV URL:", process.env.VITE_SUPABASE_URL);
console.log("DEBUG ENV KEY:", process.env.VITE_SUPABASE_ANON_KEY);

const { fetchVariablePremium } = await import('../../src/lib/insurance/variable/variableLoader');
// @ts-ignore
const { InsuranceAnalysis } = await import('../../src/types/insurance');

const mockAnalysis: InsuranceAnalysis = {
  id: "test-id",
  age: 44,
  gender: "M",
  variable: {
    subType: "term",
    monthlyPremium: 150000,
    paymentPeriod: 10,
    investmentStyle: "balanced",
    equityRatio: 50,
    isAnnuityConversion: false,
    deathBenefit: 100000000,
    coveragePeriod: 70,
    isHealthyDiscount: false
  }
} as any;

async function main() {
  const result = await fetchVariablePremium(mockAnalysis);
  console.log("=== CALCULATED TERM INSURANCE OPTIONS (Age 44, Male, 100M KRW) ===");
  result._allOptions.forEach((opt: any, idx: number) => {
    if (opt.companyName.includes("메트라이프") || idx < 10) {
      console.log(`${idx + 1}. ${opt.companyName} | ${opt.productName} | Premium: ${opt.premium}원 | Features: ${opt.features}`);
    }
  });
}

main().catch(console.error);
