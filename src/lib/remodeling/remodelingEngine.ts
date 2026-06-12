import { calculateDietPlan, calculateUpgradePlan, calculateAllUpgradePlans } from './matcher';
import { StandardizedCoverage } from '../../types/remodeling';
import { InsuranceAnalysis, AnalysisResult, RecommendationPlan } from '../../types/insurance';

export async function analyzeRemodeling(
  analysis: InsuranceAnalysis
): Promise<AnalysisResult> {
  // 1. Get or construct StandardizedCoverage
  let coverage: StandardizedCoverage = analysis._remodelingCoverage;
  if (!coverage) {
    coverage = {
      age: analysis.age,
      gender: analysis.gender,
      current_total_premium: analysis.monthlyPremium,
      cancer_diagnosis: analysis.cancer?.currentAmount || 0,
      brain_vascular: analysis.cerebrovascular?.currentAmount || 0,
      ischemic_heart: analysis.cardiovascular?.currentAmount || 0,
      caregiver_expense: 0,
      silson: false,
      surgery_amount: analysis.surgery?.currentAmount || 0,
      post_disability_amount: analysis.postDisability?.currentAmount || 0
    };
  }

  // 2. Run Matcher Calculations
  const { cheapestPlan: dietResult, allDietOptions } = await calculateDietPlan(coverage);
  const upgradeResult = calculateUpgradePlan(coverage, dietResult);
  const allUpgradeOptions = calculateAllUpgradePlans(coverage, allDietOptions);

  // 3. Construct Recommendation Plans
  const dietPlan: RecommendationPlan = {
    title: '📉 가격은 낮추고 보장은 동일하게',
    description: `기존 보장 수준을 100% 동일하게 유지하면서 월 납입 보험료를 ${Math.round((coverage.current_total_premium - dietResult.total_premium) / 10000)}만원 줄일 수 있습니다.`,
    estimatedPremium: dietResult.total_premium,
    coverageChanges: [
      `동일 보장 유지: 일반암 ${Math.round(coverage.cancer_diagnosis / 10000000) * 10}00만원`,
      `동일 보장 유지: 뇌혈관 ${Math.round(coverage.brain_vascular / 10000000) * 10}00만원`,
      `동일 보장 유지: 허혈성심장 ${Math.round(coverage.ischemic_heart / 10000000) * 10}00만원`,
      `불필요한 중복 및 고비용 특약 최적화`
    ],
    switchingLossNotice: '보장이 유지되므로 손해 없이 최저 가격으로 전환됩니다.',
    companyName: dietResult.company_name,
    productName: '무배당 간편건강 다이어트 보험'
  };

  const upgradePlan: RecommendationPlan = {
    title: '🚀 가격은 그대로 보장은 더 든든하게',
    description: '기존에 납부하던 월 예산을 유지하면서, 미비했던 핵심 진단비를 추가 보강하는 플랜입니다.',
    estimatedPremium: upgradeResult.total_premium,
    coverageChanges: [
      `일반암 보장: ${(upgradeResult.details.cancer_premium / dietResult.details.cancer_premium) > 1.2 ? '추가 확대 (+2,000만원)' : '동일 유지'}`,
      `뇌혈관 보장: ${(upgradeResult.details.brain_premium / dietResult.details.brain_premium) > 1.2 ? '추가 확대 (+1,000만원)' : '동일 유지'}`,
      `허혈성심장 보장: ${(upgradeResult.details.heart_premium / dietResult.details.heart_premium) > 1.2 ? '추가 확대 (+1,000만원)' : '동일 유지'}`,
      `동일한 월 보험료로 웅장한 핵심 보장 제공`
    ],
    switchingLossNotice: '동일 비용으로 보장이 강화되어 가성비가 상승합니다.',
    companyName: upgradeResult.company_name,
    productName: '무배당 VIP 마스터 업그레이드 건강보험'
  };

  // Standard scores out of 100 based on coverage amounts
  const cancerScore = Math.min(100, Math.round((coverage.cancer_diagnosis / 50000000) * 100));
  const cerebrovascularScore = Math.min(100, Math.round((coverage.brain_vascular / 30000000) * 100));
  const cardiovascularScore = Math.min(100, Math.round((coverage.ischemic_heart / 30000000) * 100));
  const totalScore = Math.round((cancerScore + cerebrovascularScore + cardiovascularScore) / 3);

  const deficiencies: string[] = [];
  if (coverage.cancer_diagnosis < 30000000) deficiencies.push('일반암 진단비 부족');
  if (coverage.brain_vascular < 20000000) deficiencies.push('뇌혈관질환 진단비 부족');
  if (coverage.ischemic_heart < 20000000) deficiencies.push('허혈성심장질환 진단비 부족');

  // Attach lists to analysis object
  const augmentedAnalysis = {
    ...analysis,
    _allDietOptions: allDietOptions,
    _allUpgradeOptions: allUpgradeOptions,
    _allOptions: allDietOptions // Fallback to allDietOptions for default comparison table
  };

  return {
    analysis: augmentedAnalysis,
    scores: {
      cancerScore,
      cerebrovascularScore,
      cardiovascularScore,
      totalScore
    },
    efficiency: totalScore / Math.max(1, coverage.current_total_premium / 10000),
    deficiencies,
    recommendations: {
      diet: dietPlan,
      upgrade: upgradePlan,
      hybrid: dietPlan // Default hybrid to diet for UI rendering
    }
  };
}
