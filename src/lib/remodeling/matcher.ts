import { createClient } from '../../utils/supabase/client';
import { StandardizedCoverage, RecommendedPlan } from '../../types/remodeling';

const getAgeIndex = (age: number, male: boolean): number => {
  if (male) {
    if (age <= 25) return 0.42;
    if (age <= 35) return 0.65;
    if (age <= 45) return 1.00;
    if (age <= 55) return 1.62;
    if (age <= 65) return 2.45;
    if (age <= 75) return 4.20;
    return 6.50;
  } else {
    if (age <= 25) return 0.48;
    if (age <= 35) return 0.72;
    if (age <= 45) return 1.00;
    if (age <= 55) return 1.35;
    if (age <= 65) return 1.70;
    if (age <= 75) return 2.80;
    return 4.10;
  }
};

// Robust offline fallback rate tables representing standard rates for 40-year-olds
const FALLBACK_INSURANCE_RATES = [
  { company_name: 'DB손해보험', cancer_rate_10m: 7100, brain_rate_10m: 4000, heart_rate_10m: 3100, caregiver_rate_15k: 1300 },
  { company_name: 'KB손해보험', cancer_rate_10m: 7200, brain_rate_10m: 4200, heart_rate_10m: 3300, caregiver_rate_15k: 1350 },
  { company_name: '한화손해보험', cancer_rate_10m: 7300, brain_rate_10m: 4150, heart_rate_10m: 3250, caregiver_rate_15k: 1380 },
  { company_name: '현대해상', cancer_rate_10m: 7400, brain_rate_10m: 4250, heart_rate_10m: 3350, caregiver_rate_15k: 1420 },
  { company_name: '삼성화재', cancer_rate_10m: 7500, brain_rate_10m: 4300, heart_rate_10m: 3400, caregiver_rate_15k: 1400 },
  { company_name: '메리츠화재', cancer_rate_10m: 7800, brain_rate_10m: 4100, heart_rate_10m: 3200, caregiver_rate_15k: 1450 }
];

/**
 * 1. 보험료 다이어트형 (동일 보장, 최저 가격 매칭)
 * Supabase의 요율 테이블을 조회하고 실시간 나이 보정을 통해 산출합니다.
 */
export async function calculateDietPlan(
  coverage: StandardizedCoverage
): Promise<{ cheapestPlan: RecommendedPlan; allDietOptions: any[] }> {
  const isMale = coverage.gender === 'M';
  const ageRatio = getAgeIndex(coverage.age, isMale) / getAgeIndex(40, isMale);

  let rates = FALLBACK_INSURANCE_RATES;

  try {
    const supabase = createClient();
    const { data: dbRates, error } = await supabase
      .from('insurance_rates')
      .select('*')
      .eq('gender', coverage.gender);
    
    if (!error && dbRates && dbRates.length > 0) {
      rates = dbRates.map(r => ({
        company_name: r.company_name,
        cancer_rate_10m: r.cancer_rate_10m || 7500,
        brain_rate_10m: r.brain_rate_10m || 4200,
        heart_rate_10m: r.heart_rate_10m || 3300,
        caregiver_rate_15k: r.caregiver_rate_15k || 1400
      }));
    }
  } catch (err) {
    console.warn('Failed to query insurance_rates from Supabase, using robust offline fallbacks', err);
  }

  const allDietOptions: any[] = [];
  let cheapestPlan: RecommendedPlan | null = null;

  for (const rate of rates) {
    const cancer_premium = (coverage.cancer_diagnosis / 10000000) * rate.cancer_rate_10m * ageRatio;
    const brain_premium = (coverage.brain_vascular / 10000000) * rate.brain_rate_10m * ageRatio;
    const heart_premium = (coverage.ischemic_heart / 10000000) * rate.heart_rate_10m * ageRatio;
    const caregiver_premium = (coverage.caregiver_expense / 15000) * rate.caregiver_rate_15k * ageRatio;

    const total_premium = cancer_premium + brain_premium + heart_premium + caregiver_premium;
    const rounded_total = Math.round(total_premium);

    const plan: RecommendedPlan = {
      company_name: rate.company_name,
      total_premium: rounded_total,
      details: {
        cancer_premium: Math.round(cancer_premium),
        brain_premium: Math.round(brain_premium),
        heart_premium: Math.round(heart_premium),
        caregiver_premium: Math.round(caregiver_premium)
      }
    };

    if (!cheapestPlan || rounded_total < cheapestPlan.total_premium) {
      cheapestPlan = plan;
    }

    allDietOptions.push({
      companyName: rate.company_name,
      productName: '무배당 간편건강 다이어트 보험',
      premium: rounded_total,
      category: '종합건강',
      features: '동일보장 유지 | 해약환급금 미지급형 | 실시간 최저가 매칭',
      details: plan.details
    });
  }

  // Sort options by premium ascending
  allDietOptions.sort((a, b) => a.premium - b.premium);

  const finalCheapest = cheapestPlan || {
    company_name: 'DB손해보험',
    total_premium: 100000,
    details: { cancer_premium: 50000, brain_premium: 20000, heart_premium: 20000, caregiver_premium: 10000 }
  };

  return {
    cheapestPlan: finalCheapest,
    allDietOptions
  };
}

/**
 * 2. 보장 업그레이드형 (동일 보험료, 보장 범위 극대화)
 * 기존 예산과 다이어트 플랜의 차액을 기반으로 보장을 최고 등급으로 추가 업그레이드.
 */
export function calculateUpgradePlan(
  currentCoverage: StandardizedCoverage,
  dietPlan: RecommendedPlan
): RecommendedPlan {
  const surplusBudget = currentCoverage.current_total_premium - dietPlan.total_premium;
  
  if (surplusBudget > 15000) {
    const additionalCancerPremium = Math.round(surplusBudget * 0.5);
    const additionalBrainPremium = Math.round(surplusBudget * 0.3);
    const additionalHeartPremium = Math.round(surplusBudget * 0.2);

    return {
      company_name: dietPlan.company_name,
      total_premium: dietPlan.total_premium + surplusBudget,
      details: {
        cancer_premium: dietPlan.details.cancer_premium + additionalCancerPremium,
        brain_premium: dietPlan.details.brain_premium + additionalBrainPremium,
        heart_premium: dietPlan.details.heart_premium + additionalHeartPremium,
        caregiver_premium: dietPlan.details.caregiver_premium
      }
    };
  }

  return dietPlan;
}

/**
 * 3. 전 보험사 업그레이드 옵션 리스트 연산
 * 동일 예산 하에서 각 보험사별로 최대한 추가할 수 있는 진단비를 역산해 정렬합니다.
 */
export function calculateAllUpgradePlans(
  currentCoverage: StandardizedCoverage,
  allDietOptions: any[]
): any[] {
  const allUpgradeOptions: any[] = [];
  const isMale = currentCoverage.gender === 'M';
  const ageRatio = getAgeIndex(currentCoverage.age, isMale) / getAgeIndex(40, isMale);

  for (const dietOption of allDietOptions) {
    const rate = FALLBACK_INSURANCE_RATES.find(r => r.company_name === dietOption.companyName) || FALLBACK_INSURANCE_RATES[0];
    const dietPremium = dietOption.premium;
    const surplusBudget = currentCoverage.current_total_premium - dietPremium;

    let upgradedPremium = dietPremium;
    let addedCancer = 0;
    let addedBrain = 0;
    let addedHeart = 0;

    if (surplusBudget > 10000) {
      const cancerBudget = surplusBudget * 0.5;
      const brainBudget = surplusBudget * 0.3;
      const heartBudget = surplusBudget * 0.2;

      const cancerUnitRate = rate.cancer_rate_10m * ageRatio;
      const brainUnitRate = rate.brain_rate_10m * ageRatio;
      const heartUnitRate = rate.heart_rate_10m * ageRatio;

      addedCancer = Math.round((cancerBudget / Math.max(1, cancerUnitRate)) * 10000000);
      addedBrain = Math.round((brainBudget / Math.max(1, brainUnitRate)) * 10000000);
      addedHeart = Math.round((heartBudget / Math.max(1, heartUnitRate)) * 10000000);

      // Round to nearest 1,000,000 KRW
      addedCancer = Math.round(addedCancer / 1000000) * 1000000;
      addedBrain = Math.round(addedBrain / 1000000) * 1000000;
      addedHeart = Math.round(addedHeart / 1000000) * 1000000;

      upgradedPremium = dietPremium + surplusBudget;
    }

    let upgradeFeatures = '기존 보장 동일 유지';
    if (addedCancer > 0 || addedBrain > 0 || addedHeart > 0) {
      const parts: string[] = [];
      if (addedCancer > 0) parts.push(`암 +${(addedCancer / 10000).toLocaleString()}만`);
      if (addedBrain > 0) parts.push(`뇌 +${(addedBrain / 10000).toLocaleString()}만`);
      if (addedHeart > 0) parts.push(`심장 +${(addedHeart / 10000).toLocaleString()}만`);
      upgradeFeatures = parts.join(' | ') + ' 추가 보강';
    }

    allUpgradeOptions.push({
      companyName: dietOption.companyName,
      productName: '무배당 간편건강 업그레이드 보험',
      premium: Math.round(upgradedPremium),
      category: '종합건강',
      features: upgradeFeatures,
      upgrades: {
        addedCancer,
        addedBrain,
        addedHeart
      }
    });
  }

  // Sort by total added coverage descending
  allUpgradeOptions.sort((a, b) => {
    const totalA = a.upgrades.addedCancer + a.upgrades.addedBrain + a.upgrades.addedHeart;
    const totalB = b.upgrades.addedCancer + b.upgrades.addedBrain + b.upgrades.addedHeart;
    return totalB - totalA;
  });

  return allUpgradeOptions;
}
