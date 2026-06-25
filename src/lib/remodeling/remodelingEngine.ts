import { calculateDietPlan, calculateUpgradePlan, calculateAllUpgradePlans } from './matcher';
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

function detectType(name: string): string {
  if (/의료실비|실손|실비/i.test(name)) return 'silson';
  if (/치아|치과|덴탈|크라운|임플란트/i.test(name)) return 'dental';
  if (/유병자|간편고지|3\.2\.5|3\.3\.5|3\.5\.5/i.test(name)) return 'pre_existing';
  if (/수술\/입원|수술비|입원비|입원일당|수술입원/i.test(name)) return 'surgery_hospital';
  if (/암보험|암진단|3대질환/i.test(name)) return 'cancer';
  if (/어린이|신생아|자녀|태아/i.test(name)) return 'child';
  if (/뇌혈관|뇌졸중|뇌출혈|뇌질환/i.test(name)) return 'brain';
  if (/심장질환|허혈성|심근경색|심혈관|심장/i.test(name)) return 'heart';
  if (/상해/i.test(name)) return 'accident';
  if (/간병인|간병지원|간병사용|간병\s*보험/i.test(name)) return 'caregiving';
  if (/치매/i.test(name)) return 'dementia';
  if (/재가\/시설|재가|시설급여|요양/i.test(name)) return 'nursing';
  if (/자동차/i.test(name)) return 'car';
  if (/운전자/i.test(name)) return 'driver';
  if (/펫|pet|개|고양이|반려/i.test(name)) return 'pet';
  if (/골프|레저/i.test(name)) return 'golf';
  if (/주택화재|화재|풍수해/i.test(name)) return 'fire';
  if (/재물/i.test(name)) return 'property';
  if (/연금|annuity/i.test(name)) return 'annuity';
  if (/종신|whole/i.test(name)) return 'whole';
  if (/변액|정기/i.test(name)) return 'variable';
  if (/민사\/형사|법률|소송/i.test(name)) return 'legal';
  if (/저축|savings/i.test(name)) return 'savings';
  if (/신용/i.test(name)) return 'credit';
  return 'health';
}

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
  
  if (policies.length > 0) {
    const typeCounts: Record<string, number> = {};
    for (const p of policies) {
      const type = detectType(p.product_name);
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
          _allDietOptions: [wholeResult.recommendations.diet],
          _allUpgradeOptions: [wholeResult.recommendations.upgrade],
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
          _allDietOptions: [varResult.recommendations.diet],
          _allUpgradeOptions: [varResult.recommendations.upgrade],
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
          _allDietOptions: [annResult.recommendations.diet],
          _allUpgradeOptions: [annResult.recommendations.upgrade],
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
          _allDietOptions: [drvResult.recommendations.diet],
          _allUpgradeOptions: [drvResult.recommendations.upgrade],
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
          _allDietOptions: [petResult.recommendations.diet],
          _allUpgradeOptions: [petResult.recommendations.upgrade],
          _allOptions: [petResult.recommendations.diet, petResult.recommendations.upgrade]
        },
        scores: petResult.scores,
        efficiency: petResult.efficiency,
        deficiencies: petResult.deficiencies,
        recommendations: petResult.recommendations
      };
    } else if (primaryType === 'car') {
      const carResult = analyzeCar(analysis);
      return {
        analysis: {
          ...analysis,
          _allDietOptions: [carResult.recommendations?.diet || carResult.recommendations?.hybrid],
          _allUpgradeOptions: [carResult.recommendations?.upgrade],
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
          _allDietOptions: [golfResult.recommendations.diet],
          _allUpgradeOptions: [golfResult.recommendations.upgrade],
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
          _allDietOptions: [fireResult.recommendations.diet],
          _allUpgradeOptions: [fireResult.recommendations.upgrade],
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
          _allDietOptions: [propResult.recommendations.diet],
          _allUpgradeOptions: [propResult.recommendations.upgrade],
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
          _allDietOptions: [savResult.recommendations.diet],
          _allUpgradeOptions: [savResult.recommendations.upgrade],
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
          _allDietOptions: [credResult.recommendations.diet],
          _allUpgradeOptions: [credResult.recommendations.upgrade],
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
          _allDietOptions: [legResult.recommendations.diet],
          _allUpgradeOptions: [legResult.recommendations.upgrade],
          _allOptions: [legResult.recommendations.diet, legResult.recommendations.upgrade]
        },
        scores: legResult.scores,
        efficiency: legResult.efficiency,
        deficiencies: legResult.deficiencies,
        recommendations: legResult.recommendations
      };
    }
  }

  // 2. Run Matcher Calculations
  const { cheapestPlan: dietResult, allDietOptions } = await calculateDietPlan(coverage);
  const upgradeResult = calculateUpgradePlan(coverage, dietResult);
  const allUpgradeOptions = calculateAllUpgradePlans(coverage, allDietOptions);

  // 3. Construct Recommendation Plans
  const dietPlan: RecommendationPlan = {
    title: '📉 가격은 낮추고 보장은 동일하게',
    description: `기존 보장 수준을 동일하게 유지하면서 월 납입 보험료를 ${Math.round((coverage.current_total_premium - dietResult.total_premium) / 10000)}만원 줄일 수 있습니다.`,
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
