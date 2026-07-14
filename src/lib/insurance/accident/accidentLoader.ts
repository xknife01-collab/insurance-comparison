import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';
import { ACCIDENT_PRODUCTS, AccidentProduct } from './accidentData';

export { ACCIDENT_PRODUCTS };
export type { AccidentProduct };

export const fetchAccidentPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const rawOpts = (analysis.accident || {}) as any;
  const toNum = (val: any, fallback: number): number => {
    if (val === undefined || val === null) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  const opts = {
    accidentDeathLimit:      toNum(rawOpts.accidentDeathLimit      ?? (rawOpts as any).deathAmt,      50000000),
    accidentDisabilityLimit: toNum(rawOpts.accidentDisabilityLimit ?? (rawOpts as any).disabilityAmt, 50000000),
    fractureLimit:           toNum(rawOpts.fractureLimit           ?? (rawOpts as any).fractureAmt,   300000),
    castLimit:               toNum(rawOpts.castLimit,               100000),
    surgeryLimit:            toNum(rawOpts.surgeryLimit,            500000),
    hospitalDailyLimit:      toNum(rawOpts.hospitalDailyLimit,      20000),
    jobClass:                toNum(rawOpts.jobClass,                1),
    drivingType:             rawOpts.drivingType             ?? 'private',
    hasLeisureRider:         rawOpts.hasLeisureRider         ?? (rawOpts as any).leisureRider  ?? false
  };


  // 1. 나이에 따른 위험요율 가중치 곡선
  const age = analysis.age || 40;
  let ageMultiplier = 1.0;
  if (age <= 20) ageMultiplier = 0.70;
  else if (age <= 30) ageMultiplier = 0.85;
  else if (age <= 40) ageMultiplier = 1.00;
  else if (age <= 50) ageMultiplier = 1.20;
  else if (age <= 60) ageMultiplier = 1.50;
  else if (age <= 70) ageMultiplier = 2.00;
  else ageMultiplier = 2.50;

  // 2. 성별에 따른 가중치 보정
  const gender = (analysis.gender || 'M').toString().toUpperCase().startsWith('M') ? 'M' : 'F';
  const genderMultiplier = gender === 'M' ? 1.15 : 0.85;

  // 3. 직업급수에 따른 상해 가중치 보정 (상해보험은 직업급수가 매우 중요)
  const jobClass = opts.jobClass || 1;
  const jobMultiplier = jobClass === 3 ? 1.60 : jobClass === 2 ? 1.30 : 1.00;

  // 4. 운전 형태에 따른 가중치 보정
  const drivingType = opts.drivingType || 'private';
  const drivingMultiplier = drivingType === 'commercial' ? 1.50 : drivingType === 'private' ? 1.10 : 0.90;

  // 5. 가입 한도에 따른 요율 누적 계산
  const deathBaseLimit = 50000000;
  const deathRatio = opts.accidentDeathLimit / deathBaseLimit;
  
  const disabilityBaseLimit = 50000000;
  const disabilityRatio = opts.accidentDisabilityLimit / disabilityBaseLimit;
  
  const fractureBaseLimit = 300000;
  const fractureRatio = opts.fractureLimit / fractureBaseLimit;
  
  const surgeryBaseLimit = 500000;
  const surgeryRatio = opts.surgeryLimit / surgeryBaseLimit;

  // 각 진단비/수술비 비중 요율 합산
  const coverageMultiplier = 
    0.30 +
    (deathRatio * 0.35) + 
    (disabilityRatio * 0.25) + 
    (fractureRatio * 0.05) + 
    (surgeryRatio * 0.05);

  // 6. 특약 가입 비용 누적
  // 깁스치료비 및 상해입원일당, 레저스포츠 특약
  let riderCost = 0;
  if (opts.castLimit > 0) {
    riderCost += (opts.castLimit / 100000) * 500; // 10만 원당 500원
  }
  if (opts.hospitalDailyLimit > 0) {
    riderCost += (opts.hospitalDailyLimit / 10000) * 1500; // 1만 원당 1500원
  }
  if (opts.hasLeisureRider) {
    riderCost += 3000; // 레저특약 3000원 추가
  }

  const combinedMultiplier = 
    ageMultiplier * 
    genderMultiplier * 
    jobMultiplier * 
    drivingMultiplier * 
    coverageMultiplier;

  // 7. Supabase 연동 및 로컬 폴백 매핑
  let activeProducts = ACCIDENT_PRODUCTS;
  try {
    const supabase = createClient();
    const { data: dbProducts, error } = await supabase
      .from('accident_products')
      .select('company_name, product_name, base_premium');

    if (dbProducts && dbProducts.length > 0 && !error) {
      activeProducts = dbProducts.map(p => {
        return {
          company: p.company_name,
          productName: p.product_name,
          basePremium: p.base_premium
        };
      });
    }
  } catch (err) {
    console.warn("[Accident] Supabase fetch failed. Falling back to local data.", err);
  }

  // 8. 최종 보험료 산출
  const results = activeProducts.map(p => {
    // 특약에 나이/직업 가중치 반영
    const rawPremium = p.basePremium * combinedMultiplier + (riderCost * ageMultiplier * jobMultiplier);
    const finalPremium = Math.max(5000, Math.round(rawPremium / 100) * 100);

    const details: Record<string, string> = {
      '상해사망 보장': `${(opts.accidentDeathLimit / 10000).toLocaleString()}만 원`,
      '상해후유장해': `${(opts.accidentDisabilityLimit / 10000).toLocaleString()}만 원`,
      '골절 진단비': `${(opts.fractureLimit / 10000).toLocaleString()}만 원`,
      '상해 수술비': `${(opts.surgeryLimit / 10000).toLocaleString()}만 원`,
      '깁스 치료비': opts.castLimit > 0 ? `${(opts.castLimit / 10000).toLocaleString()}만 원` : '미가입',
      '상해 입원일당': opts.hospitalDailyLimit > 0 ? `${(opts.hospitalDailyLimit / 10000).toLocaleString()}만 원` : '미가입',
      '레저스포츠 특약': opts.hasLeisureRider ? '가입 완료' : '미가입',
    };

    return {
      premium: finalPremium,
      productName: p.productName,
      companyName: p.company,
      planLevel: opts.accidentDeathLimit >= 150000000 ? '고급형' : opts.accidentDeathLimit >= 80000000 ? '표준형' : '실속형',
      details
    };
  });

  // 보험료 낮은 순으로 정렬
  results.sort((a, b) => a.premium - b.premium);

  // 9. 추천 플랜 요율 (Diet, Upgrade, Hybrid) 동적 매칭
  const dietOpts = {
    accidentDeathLimit: 50000000,
    accidentDisabilityLimit: 30000000,
    fractureLimit: 300000,
    castLimit: 0,
    surgeryLimit: 300000,
    hospitalDailyLimit: 0,
    jobClass: opts.jobClass,
    drivingType: opts.drivingType,
    hasLeisureRider: false
  };

  const upgradeOpts = {
    accidentDeathLimit: 100000000,
    accidentDisabilityLimit: 80000000,
    fractureLimit: 500000,
    castLimit: 200000,
    surgeryLimit: 1000000,
    hospitalDailyLimit: 20000,
    jobClass: opts.jobClass,
    drivingType: opts.drivingType,
    hasLeisureRider: true
  };

  const hybridOpts = {
    accidentDeathLimit: 200000000,
    accidentDisabilityLimit: 150000000,
    fractureLimit: 1000000,
    castLimit: 500000,
    surgeryLimit: 2000000,
    hospitalDailyLimit: 50000,
    jobClass: opts.jobClass,
    drivingType: opts.drivingType,
    hasLeisureRider: true
  };

  const calculatePremiumForConfig = (configOpts: typeof opts) => {
    const configDeathRatio = configOpts.accidentDeathLimit / deathBaseLimit;
    const configDisabilityRatio = configOpts.accidentDisabilityLimit / disabilityBaseLimit;
    const configFractureRatio = configOpts.fractureLimit / fractureBaseLimit;
    const configSurgeryRatio = configOpts.surgeryLimit / surgeryBaseLimit;

    const configCoverageMultiplier = 
      0.30 +
      (configDeathRatio * 0.35) + 
      (configDisabilityRatio * 0.25) + 
      (configFractureRatio * 0.05) + 
      (configSurgeryRatio * 0.05);

    let configRiderCost = 0;
    if (configOpts.castLimit > 0) {
      configRiderCost += (configOpts.castLimit / 100000) * 500;
    }
    if (configOpts.hospitalDailyLimit > 0) {
      configRiderCost += (configOpts.hospitalDailyLimit / 10000) * 1500;
    }
    if (configOpts.hasLeisureRider) {
      configRiderCost += 3000;
    }

    const configCombinedMultiplier = 
      ageMultiplier * 
      genderMultiplier * 
      jobMultiplier * 
      drivingMultiplier * 
      configCoverageMultiplier;

    const configResults = activeProducts.map(p => {
      const rawPremium = p.basePremium * configCombinedMultiplier + (configRiderCost * ageMultiplier * jobMultiplier);
      const finalPremium = Math.max(5000, Math.round(rawPremium / 100) * 100);
      return {
        premium: finalPremium,
        productName: p.productName,
        companyName: p.company
      };
    });

    configResults.sort((a, b) => a.premium - b.premium);
    return configResults;
  };

  const dietPlan = calculatePremiumForConfig(dietOpts);
  const upgradePlan = calculatePremiumForConfig(upgradeOpts);
  const hybridPlan = calculatePremiumForConfig(hybridOpts);

  return {
    premium: results[0].premium,
    productName: results[0].productName,
    companyName: results[0].companyName,
    _allOptions: results,
    _dietPlan: dietPlan[0],
    _upgradePlan: upgradePlan[0],
    _hybridPlan: hybridPlan[0],
    _upgradePlans: upgradePlan,
    _hybridPlans: hybridPlan
  };
};