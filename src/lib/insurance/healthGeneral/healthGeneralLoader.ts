import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';
import { HEALTH_GENERAL_PRODUCTS, HealthGeneralProduct } from './healthGeneralData';

export { HEALTH_GENERAL_PRODUCTS };
export type { HealthGeneralProduct };

export const fetchHealthGeneralPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const hg = (analysis.healthGeneral || {}) as any;
  const opts = {
    cancerLimit: hg.cancerLimit ?? 50000000,
    similarCancerLimit: hg.similarCancerLimit ?? 10000000,
    brainLimit: hg.brainLimit ?? 20000000,
    heartLimit: hg.heartLimit ?? 20000000,
    cardioLimit: hg.cardioLimit ?? 10000000,
    has1to5Surgery: hg.has1to5Surgery ?? true,
    hasTargetedTherapy: hg.hasTargetedTherapy ?? true,
    hasThrombolysis: hg.hasThrombolysis ?? false,
    hasLiability: hg.hasLiability ?? true,
    paymentPeriod: hg.paymentPeriod ?? 20,
    coveragePeriod: hg.coveragePeriod ?? 90,
    isRenewable: hg.isRenewable ?? false,
    refundType: hg.refundType ?? 'low'
  };

  // 1. 나이에 따른 위험요율 가중치 곡선 (40세 기준 1.0)
  const age = analysis.age || 40;
  let ageMultiplier = 1.0;
  if (age <= 20) ageMultiplier = 0.55;
  else if (age <= 25) ageMultiplier = 0.65;
  else if (age <= 30) ageMultiplier = 0.75;
  else if (age <= 35) ageMultiplier = 0.85;
  else if (age <= 40) ageMultiplier = 1.00;
  else if (age <= 45) ageMultiplier = 1.20;
  else if (age <= 50) ageMultiplier = 1.50;
  else if (age <= 55) ageMultiplier = 1.85;
  else if (age <= 60) ageMultiplier = 2.30;
  else if (age <= 65) ageMultiplier = 2.80;
  else ageMultiplier = 3.50;

  // 2. 성별에 따른 가중치 보정
  const gender = (analysis.gender || 'M').toString().toUpperCase().startsWith('M') ? 'M' : 'F';
  const genderMultiplier = gender === 'M' ? 1.05 : 0.95;

  // 3. 직업급수에 따른 상해 및 후유장해 가중치 보정
  const jobClass = analysis.jobClass || 1;
  const jobMultiplier = jobClass === 3 ? 1.30 : jobClass === 2 ? 1.15 : 1.00;

  // 4. 가입 한도에 따른 요율 누적 계산
  const cancerBaseLimit = 30000000;
  const cancerLimitRatio = opts.cancerLimit / cancerBaseLimit;
  const similarLimitRatio = opts.similarCancerLimit / 6000000;
  
  const brainBaseLimit = 20000000;
  const brainLimitRatio = opts.brainLimit / brainBaseLimit;
  
  const heartBaseLimit = 20000000;
  const heartLimitRatio = opts.heartLimit / heartBaseLimit;
  
  const cardioBaseLimit = 10000000;
  const cardioLimitRatio = opts.cardioLimit / cardioBaseLimit;

  // 각 진단비 비중 요율 합산 (기본형 4.8~5만원대, 종합형 7.8만원대 조율용상수 도입)
  const coverageMultiplier = 
    0.40 +
    (cancerLimitRatio * 0.35) + 
    (similarLimitRatio * 0.05) + 
    (brainLimitRatio * 0.15) + 
    (heartLimitRatio * 0.10) + 
    (cardioLimitRatio * 0.03);

  // 5. 계약 옵션 가중치 적용
  let paymentPeriodMultiplier = 1.0;
  if (opts.paymentPeriod === 10) paymentPeriodMultiplier = 1.60;
  else if (opts.paymentPeriod === 30) paymentPeriodMultiplier = 0.80;

  let coveragePeriodMultiplier = 1.0;
  if (opts.coveragePeriod === 80) coveragePeriodMultiplier = 0.85;
  else if (opts.coveragePeriod === 100) coveragePeriodMultiplier = 1.15;

  const refundMultiplier = opts.refundType === 'low' ? 0.75 : 1.00;
  const renewalMultiplier = opts.isRenewable ? 0.45 : 1.00;

  // 6. 특약 가입 비용 누적
  let riderCost = 0;
  if (opts.has1to5Surgery) riderCost += 5000;
  if (opts.hasTargetedTherapy) riderCost += 3000;
  if (opts.hasThrombolysis) riderCost += 1500;
  if (opts.hasLiability) riderCost += 1000;

  const combinedMultiplier = 
    ageMultiplier * 
    genderMultiplier * 
    jobMultiplier * 
    coverageMultiplier * 
    paymentPeriodMultiplier * 
    coveragePeriodMultiplier * 
    refundMultiplier * 
    renewalMultiplier;

  // 7. Supabase 연동 및 로컬 폴백 매핑
  let activeProducts = HEALTH_GENERAL_PRODUCTS;
  try {
    const supabase = createClient();
    const { data: dbProducts, error } = await supabase
      .from('health_general_products')
      .select('company_name, product_name');

    if (dbProducts && dbProducts.length > 0 && !error) {
      activeProducts = dbProducts.map(p => {
        // 로컬 정적 데이터에서 해당 상품의 basePremium 매칭 (기본값 65,000원)
        const localMatch = HEALTH_GENERAL_PRODUCTS.find(lp => lp.productName === p.product_name);
        return {
          company: p.company_name,
          productName: p.product_name,
          basePremium: localMatch ? localMatch.basePremium : 65000
        };
      });
    }
  } catch (err) {
    console.warn("[HealthGeneral] Supabase fetch failed. Falling back to local data.", err);
  }

  // 종합건강보험이 아닌 단독형/연납형 상품(암보장형, 2대질병형, 당뇨형, 연납 등) 필터링
  activeProducts = activeProducts.filter(p => {
    const name = p.productName;
    const isSpecialized = 
      name.includes('암보장형') || 
      name.includes('2대질병보장형') || 
      name.includes('당뇨') || 
      name.includes('암보장') || 
      name.includes('연납');
    return !isSpecialized;
  });

  // 8. 최종 보험료 산출
  const results = activeProducts.map(p => {
    const rawPremium = p.basePremium * combinedMultiplier + (riderCost * ageMultiplier);
    const finalPremium = Math.max(15000, Math.round(rawPremium / 100) * 100);

    const details: Record<string, string> = {
      '일반암 진단비': `${(opts.cancerLimit / 10000).toLocaleString()}만 원`,
      '유사암 진단비': `${(opts.similarCancerLimit / 10000).toLocaleString()}만 원`,
      '뇌혈관질환': `${(opts.brainLimit / 10000).toLocaleString()}만 원`,
      '허혈성 심장': `${(opts.heartLimit / 10000).toLocaleString()}만 원`,
      '심혈관(부정맥 등)': `${(opts.cardioLimit / 10000).toLocaleString()}만 원`,
      '1-5종 수술비': opts.has1to5Surgery ? '최대 1,000만원 한도' : '미가입',
      '표적항암 치료비': opts.hasTargetedTherapy ? '최대 7,000만원 한도' : '미가입',
      '일상생활 배상책임': opts.hasLiability ? '대인/대물 1억원 한도' : '미가입',
    };

    return {
      premium: finalPremium,
      productName: p.productName,
      companyName: p.company,
      planLevel: opts.cancerLimit >= 70000000 ? '고급형' : opts.cancerLimit >= 40000000 ? '표준형' : '실속형',
      details
    };
  });

  // 보험료 낮은 순으로 정렬
  results.sort((a, b) => a.premium - b.premium);

  // 9. 3대 추천 카드 플랜 요율 및 최저가 상품 동적 매칭
  const dietOpts = {
    cancerLimit: 30000000,
    similarCancerLimit: 6000000,
    brainLimit: 10000000,
    heartLimit: 10000000,
    cardioLimit: 0,
    has1to5Surgery: false,
    hasTargetedTherapy: false,
    hasThrombolysis: false,
    hasLiability: false,
    paymentPeriod: 20,
    coveragePeriod: 80,
    isRenewable: false,
    refundType: 'low'
  };

  const upgradeOpts = {
    cancerLimit: Math.max(50000000, opts.cancerLimit + 20000000),
    similarCancerLimit: Math.max(10000000, (opts.cancerLimit + 20000000) * 0.2),
    brainLimit: Math.max(30000000, opts.brainLimit + 10000000),
    heartLimit: Math.max(20000000, opts.heartLimit + 10000000),
    cardioLimit: Math.max(10000000, opts.cardioLimit + 10000000),
    has1to5Surgery: true,
    hasTargetedTherapy: true,
    hasThrombolysis: opts.hasThrombolysis || true,
    hasLiability: true,
    paymentPeriod: opts.paymentPeriod,
    coveragePeriod: opts.coveragePeriod,
    isRenewable: opts.isRenewable,
    refundType: opts.refundType
  };

  const hybridOpts = {
    cancerLimit: Math.max(100000000, opts.cancerLimit + 50000000),
    similarCancerLimit: Math.max(20000000, (opts.cancerLimit + 50000000) * 0.2),
    brainLimit: Math.max(50000000, opts.brainLimit + 30000000),
    heartLimit: Math.max(30000000, opts.heartLimit + 20000000),
    cardioLimit: Math.max(20000000, opts.cardioLimit + 10000000),
    has1to5Surgery: true,
    hasTargetedTherapy: true,
    hasThrombolysis: true,
    hasLiability: true,
    paymentPeriod: opts.paymentPeriod,
    coveragePeriod: opts.coveragePeriod,
    isRenewable: opts.isRenewable,
    refundType: opts.refundType
  };

  const calculatePremiumForConfig = (configOpts: any) => {
    // 진단비 비중 요율 합산
    const configCancerLimitRatio = configOpts.cancerLimit / cancerBaseLimit;
    const configSimilarLimitRatio = configOpts.similarCancerLimit / 6000000;
    const configBrainLimitRatio = configOpts.brainLimit / brainBaseLimit;
    const configHeartLimitRatio = configOpts.heartLimit / heartBaseLimit;
    const configCardioLimitRatio = configOpts.cardioLimit / cardioBaseLimit;

    const configCoverageMultiplier = 
      0.40 +
      (configCancerLimitRatio * 0.35) + 
      (configSimilarLimitRatio * 0.05) + 
      (configBrainLimitRatio * 0.15) + 
      (configHeartLimitRatio * 0.10) + 
      (configCardioLimitRatio * 0.03);

    let configPaymentPeriodMultiplier = 1.0;
    if (configOpts.paymentPeriod === 10) configPaymentPeriodMultiplier = 1.60;
    else if (configOpts.paymentPeriod === 30) configPaymentPeriodMultiplier = 0.80;

    let configCoveragePeriodMultiplier = 1.0;
    if (configOpts.coveragePeriod === 80) configCoveragePeriodMultiplier = 0.85;
    else if (configOpts.coveragePeriod === 100) configCoveragePeriodMultiplier = 1.15;

    const configRefundMultiplier = configOpts.refundType === 'low' ? 0.75 : 1.00;
    const configRenewalMultiplier = configOpts.isRenewable ? 0.45 : 1.00;

    let configRiderCost = 0;
    if (configOpts.has1to5Surgery) configRiderCost += 5000;
    if (configOpts.hasTargetedTherapy) configRiderCost += 3000;
    if (configOpts.hasThrombolysis) configRiderCost += 1500;
    if (configOpts.hasLiability) configRiderCost += 1000;

    const configCombinedMultiplier = 
      ageMultiplier * 
      genderMultiplier * 
      jobMultiplier * 
      configCoverageMultiplier * 
      configPaymentPeriodMultiplier * 
      configCoveragePeriodMultiplier * 
      configRefundMultiplier * 
      configRenewalMultiplier;

    const configResults = activeProducts.map(p => {
      const rawPremium = p.basePremium * configCombinedMultiplier + (configRiderCost * ageMultiplier);
      const finalPremium = Math.max(15000, Math.round(rawPremium / 100) * 100);
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
