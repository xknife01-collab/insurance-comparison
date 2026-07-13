import { calculateDietPlan, calculateUpgradePlan, calculateAllUpgradePlans } from './matcher';
import { buildCategoryOptions, detectCategoryFromPolicy } from './categoryMatcher';
import { StandardizedCoverage } from '../../types/remodeling';
import { InsuranceAnalysis, AnalysisResult, RecommendationPlan } from '../../types/insurance';
import { analyzeWholeLife } from '../insurance/wholeLife/wholeLifeEngine';
import { analyzeVariable } from '../insurance/variable/variableEngine';
import { analyzeAnnuity } from '../insurance/annuity/annuityEngine';
import { analyzeDriver } from '../insurance/driver/driverEngine';
import { analyzePet } from '../insurance/pet/petEngine';
import { analyzeCar } from '../insurance/car/carEngine';
import { analyzeGolf } from '../insurance/golf/golfEngine';
import { analyzeFire } from '../insurance/fire/fireEngine';
import { analyzeProperty } from '../insurance/property/propertyEngine';
import { analyzeSavings } from '../insurance/savings/savingsEngine';
import { analyzeCredit } from '../insurance/credit/creditEngine';
import { analyzeLegal } from '../insurance/legal/legalEngine';


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

  // 💡 리모델링 가입 보험들 중 주를 이루는 보험 종류를 스캔하여 해당하는 AI 엔진 결과를 활용하여 점수 및 리포트 구성
  const policies = coverage.policies || [];
  
  // Pre-fetch category-specific options from Supabase loader
  let catDietOptions: any[] = [];
  let catUpgradeOptions: any[] = [];
  if (policies.length > 0) {
    const analysisWithAge = {
      ...analysis,
      age: coverage.age || analysis.age || 40,
      gender: coverage.gender || analysis.gender || 'M',
    };
    try {
      const categoryResults = await buildCategoryOptions(policies, analysisWithAge);
      catDietOptions = categoryResults.allDietOptions || [];
      catUpgradeOptions = categoryResults.allUpgradeOptions || [];
    } catch (e) {
      console.warn('[RemodelingEngine] buildCategoryOptions failed:', e);
    }
  }

  if (policies.length > 0) {
    const typeCounts: Record<string, number> = {};
    for (const p of policies) {
      const type = detectCategoryFromPolicy(p);
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
    
    let primaryType = '';
    let maxCount = 0;
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        primaryType = type;
      }
    }

    if (primaryType === 'whole') {
      const wholeResult = analyzeWholeLife(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [wholeResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [wholeResult.recommendations.upgrade],
          _allOptions: [wholeResult.recommendations.diet, wholeResult.recommendations.upgrade]
        },
        scores: wholeResult.scores,
        efficiency: wholeResult.efficiency,
        deficiencies: wholeResult.deficiencies,
        recommendations: wholeResult.recommendations
      };
    } else if (primaryType === 'variable') {
      const varResult = analyzeVariable(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [varResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [varResult.recommendations.upgrade],
          _allOptions: [varResult.recommendations.diet, varResult.recommendations.upgrade]
        },
        scores: varResult.scores,
        efficiency: varResult.efficiency,
        deficiencies: varResult.deficiencies,
        recommendations: varResult.recommendations
      };
    } else if (primaryType === 'annuity') {
      const annResult = analyzeAnnuity(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [annResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [annResult.recommendations.upgrade],
          _allOptions: [annResult.recommendations.diet, annResult.recommendations.upgrade]
        },
        scores: annResult.scores,
        efficiency: annResult.efficiency,
        deficiencies: annResult.deficiencies,
        recommendations: annResult.recommendations
      };
    } else if (primaryType === 'driver') {
      const drvResult = analyzeDriver(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [drvResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [drvResult.recommendations.upgrade],
          _allOptions: [drvResult.recommendations.diet, drvResult.recommendations.upgrade]
        },
        scores: drvResult.scores,
        efficiency: drvResult.efficiency,
        deficiencies: drvResult.deficiencies,
        recommendations: drvResult.recommendations
      };
    } else if (primaryType === 'pet') {
      const petResult = analyzePet(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [petResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [petResult.recommendations.upgrade],
          _allOptions: [petResult.recommendations.diet, petResult.recommendations.upgrade]
        },
        scores: petResult.scores,
        efficiency: petResult.efficiency,
        deficiencies: petResult.deficiencies,
        recommendations: petResult.recommendations
      };
    } else if (primaryType === 'car') {
      const carResult = await analyzeCar(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [carResult.recommendations?.diet || carResult.recommendations?.hybrid].filter(Boolean),
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [carResult.recommendations?.upgrade].filter(Boolean),
          _allOptions: [carResult.recommendations?.diet || carResult.recommendations?.hybrid, carResult.recommendations?.upgrade].filter(Boolean)
        },
        scores: carResult.scores,
        efficiency: carResult.efficiency,
        deficiencies: carResult.deficiencies || [],
        recommendations: carResult.recommendations
      };
    } else if (primaryType === 'golf') {
      const golfResult = analyzeGolf(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [golfResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [golfResult.recommendations.upgrade],
          _allOptions: [golfResult.recommendations.diet, golfResult.recommendations.upgrade]
        },
        scores: golfResult.scores,
        efficiency: golfResult.efficiency,
        deficiencies: golfResult.deficiencies,
        recommendations: golfResult.recommendations
      };
    } else if (primaryType === 'fire') {
      const fireResult = analyzeFire(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [fireResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [fireResult.recommendations.upgrade],
          _allOptions: [fireResult.recommendations.diet, fireResult.recommendations.upgrade]
        },
        scores: fireResult.scores,
        efficiency: fireResult.efficiency,
        deficiencies: fireResult.deficiencies,
        recommendations: fireResult.recommendations
      };
    } else if (primaryType === 'property') {
      const propResult = analyzeProperty(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [propResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [propResult.recommendations.upgrade],
          _allOptions: [propResult.recommendations.diet, propResult.recommendations.upgrade]
        },
        scores: propResult.scores,
        efficiency: propResult.efficiency,
        deficiencies: propResult.deficiencies,
        recommendations: propResult.recommendations
      };
    } else if (primaryType === 'savings') {
      const savResult = analyzeSavings(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [savResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [savResult.recommendations.upgrade],
          _allOptions: [savResult.recommendations.diet, savResult.recommendations.upgrade]
        },
        scores: savResult.scores,
        efficiency: savResult.efficiency,
        deficiencies: savResult.deficiencies,
        recommendations: savResult.recommendations
      };
    } else if (primaryType === 'credit') {
      const credResult = analyzeCredit(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [credResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [credResult.recommendations.upgrade],
          _allOptions: [credResult.recommendations.diet, credResult.recommendations.upgrade]
        },
        scores: credResult.scores,
        efficiency: credResult.efficiency,
        deficiencies: credResult.deficiencies,
        recommendations: credResult.recommendations
      };
    } else if (primaryType === 'legal') {
      const legResult = analyzeLegal(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: catDietOptions.length > 0 ? catDietOptions : [legResult.recommendations.diet],
          _allUpgradeOptions: catUpgradeOptions.length > 0 ? catUpgradeOptions : [legResult.recommendations.upgrade],
          _allOptions: [legResult.recommendations.diet, legResult.recommendations.upgrade]
        },
        scores: legResult.scores,
        efficiency: legResult.efficiency,
        deficiencies: legResult.deficiencies,
        recommendations: legResult.recommendations
      };
    }
  }

  // 2. Run Category-based Supabase Loader (policies가 있을 때 우선 실행)
  const hasPolicies = coverage.policies && coverage.policies.length > 0;

  let allDietOptions: any[]    = [];
  let allUpgradeOptions: any[] = [];
  let dietResult: any          = null;
  let upgradeResult: any       = null;

  if (hasPolicies) {
    // ✅ coverage.age/gender를 analysis에 주입 → 모든 Loader가 정확한 나이 기준으로 계산
    const analysisWithAge: typeof analysis = {
      ...analysis,
      age:    coverage.age    || analysis.age    || 40,
      gender: coverage.gender || analysis.gender || 'M',
    };

    // 각 카테고리 Loader → Supabase 실제 상품명·회사명·보험료 조회
    const categoryResults = await buildCategoryOptions(coverage.policies!, analysisWithAge);
    allDietOptions    = categoryResults.allDietOptions;
    allUpgradeOptions = categoryResults.allUpgradeOptions;

    // 카테고리별 최저가 기준으로 dietResult / upgradeResult 구성
    const topDiet    = allDietOptions[0];
    const topUpgrade = allUpgradeOptions[0] || topDiet;

    dietResult = {
      company_name:  topDiet?.companyName || 'DB손해보험',
      total_premium: topDiet?.premium     || coverage.current_total_premium,
      details: { cancer_premium: 0, brain_premium: 0, heart_premium: 0, caregiver_premium: 0 }
    };
    upgradeResult = {
      company_name:  topUpgrade?.companyName || dietResult.company_name,
      total_premium: topUpgrade?.premium     || coverage.current_total_premium,
      details: { cancer_premium: 0, brain_premium: 0, heart_premium: 0, caregiver_premium: 0 }
    };
  } else {
    // Fallback: 기존 matcher.ts (insurance_rates 테이블 기반)
    const matcherResult = await calculateDietPlan(coverage);
    dietResult          = matcherResult.cheapestPlan;
    allDietOptions      = matcherResult.allDietOptions;
    upgradeResult       = calculateUpgradePlan(coverage, dietResult);
    allUpgradeOptions   = calculateAllUpgradePlans(coverage, allDietOptions);
  }

  // 3. Construct Recommendation Plans (실제 Supabase 상품명 사용)
  const topDietOption    = allDietOptions[0];
  const topUpgradeOption = allUpgradeOptions[0] || topDietOption;

  const dietProductName    = topDietOption?.productName    || dietResult?.company_name    || '최적화 다이어트 보험';
  const upgradeProductName = topUpgradeOption?.productName || upgradeResult?.company_name || '최적화 업그레이드 보험';
  const dietCompanyName    = topDietOption?.companyName    || dietResult?.company_name    || 'DB손해보험';
  const upgradeCompanyName = topUpgradeOption?.companyName || upgradeResult?.company_name || dietCompanyName;

  const premiumSaving = Math.max(0, coverage.current_total_premium - (dietResult?.total_premium || 0));

  const dietPlan: RecommendationPlan = {
    title: '📉 가격은 낮추고 보장은 동일하게',
    description: premiumSaving > 0
      ? `기존 보장을 동일하게 유지하면서 월 납입 보험료를 ${Math.round(premiumSaving / 10000)}만원 줄일 수 있습니다.`
      : `Supabase 실시간 분석 결과, 현재 가입하신 보험 중 동일 보장 기준 최적 상품을 매칭했습니다.`,
    estimatedPremium: dietResult?.total_premium || coverage.current_total_premium,
    coverageChanges: [
      `동일 보장 유지: 일반암 ${Math.round(coverage.cancer_diagnosis / 10000000) * 10}00만원`,
      `동일 보장 유지: 뇌혈관 ${Math.round(coverage.brain_vascular / 10000000) * 10}00만원`,
      `동일 보장 유지: 허혈성심장 ${Math.round(coverage.ischemic_heart / 10000000) * 10}00만원`,
      `불필요한 중복 및 고비용 특약 최적화`
    ],
    switchingLossNotice: '보장이 유지되므로 손해 없이 최저 가격으로 전환됩니다.',
    companyName: dietCompanyName,
    productName: dietProductName,
  };

  const upgradePlan: RecommendationPlan = {
    title: '🚀 가격은 그대로 보장은 더 든든하게',
    description: '기존에 납부하던 월 예산을 유지하면서, 미비했던 핵심 진단비를 추가 보강하는 플랜입니다.',
    estimatedPremium: upgradeResult?.total_premium || coverage.current_total_premium,
    coverageChanges: [
      `일반암 보장: ${coverage.cancer_diagnosis >= 50000000 ? '동일 유지' : '추가 확대 (+2,000만원)'}`,
      `뇌혈관 보장: ${coverage.brain_vascular   >= 30000000 ? '동일 유지' : '추가 확대 (+1,000만원)'}`,
      `허혈성심장 보장: ${coverage.ischemic_heart >= 30000000 ? '동일 유지' : '추가 확대 (+1,000만원)'}`,
      `동일한 월 보험료로 웅장한 핵심 보장 제공`
    ],
    switchingLossNotice: '동일 비용으로 보장이 강화되어 가성비가 상승합니다.',
    companyName: upgradeCompanyName,
    productName: upgradeProductName,
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
