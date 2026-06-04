import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { fetchCreditPremium } from '../../src/lib/insurance/credit/creditLoader.ts';
import { analyzeCredit } from '../../src/lib/insurance/credit/creditEngine.ts';

const test = async () => {
  console.log("=== Testing '대출안심형' ===");
  const analysisRelief = {
    age: 40,
    gender: 'M' as const,
    selectedCategory: '신용보험',
    subType: '대출안심형',
    credit: {
      loanType: 'mortgage' as const,
      loanAmount: 100000000,
      loanPeriod: 10,
      creditBureau: 'nice' as const,
      creditScore: 850,
      hasIllnessRider: true,
      hasDisabilityRider: true
    },
    cancer: { currentAmount: 0, targetAmount: 0 },
    cerebrovascular: { currentAmount: 0, targetAmount: 0 },
    cardiovascular: { currentAmount: 0, targetAmount: 0 },
    surgery: { currentAmount: 0, targetAmount: 0 },
    postDisability: { currentAmount: 0, targetAmount: 0 },
    paymentExemption: 'standard' as const,
    healthStatus: 'standard' as const,
    monthlyPremium: 0
  };

  const resRelief = await fetchCreditPremium(analysisRelief);
  const analysisResultRelief = analyzeCredit(resRelief);
  console.log("Diet Plan Premium:", analysisResultRelief.recommendations.diet.estimatedPremium);
  console.log("Upgrade Plan Premium:", analysisResultRelief.recommendations.upgrade.estimatedPremium);
  console.log("Hybrid Plan Premium:", analysisResultRelief.recommendations.hybrid.estimatedPremium);

  console.log("\n=== Testing '정기보장형' ===");
  const analysisTerm = {
    ...analysisRelief,
    subType: '정기보장형'
  };
  const resTerm = await fetchCreditPremium(analysisTerm);
  const analysisResultTerm = analyzeCredit(resTerm);
  console.log("Diet Plan Premium:", analysisResultTerm.recommendations.diet.estimatedPremium);
  console.log("Upgrade Plan Premium:", analysisResultTerm.recommendations.upgrade.estimatedPremium);
  console.log("Hybrid Plan Premium:", analysisResultTerm.recommendations.hybrid.estimatedPremium);
};

test().catch(err => console.error("Error:", err));
