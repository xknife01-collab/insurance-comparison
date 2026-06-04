import { InsuranceAnalysis, AnalysisResult } from '../../../types/insurance';
import { CAR_DATABASE, CAR_MODEL_MAP } from '../../../data/carDatabase';

import { getEngineOptions, getTrimOptions } from './carSpecHelpers';

// 운전자 범위별 할증율
const DRIVER_MULTIPLIERS: Record<string, number> = {
  single: 1.0,
  couple: 1.15,
  family: 1.35,
  anyone: 1.70,
};

const DRIVER_LABELS: Record<string, string> = {
  single: '피보험자 1인 한정',
  couple: '부부 한정 특약',
  family: '가족 한정 특약',
  anyone: '누구나 운전',
};

export const analyzeCar = async (analysis: InsuranceAnalysis): Promise<AnalysisResult> => {
  const car = analysis.car || {
    annualMileage: 'under_5k' as const,
    safeDrivingScore: 'under_80' as const,
    hasConnectedCar: true,
    hasBlackbox: true,
    hasChildRider: false,
    currentPropertyLimit: 2,
    currentInjuryType: 'jason' as const,
    brand: 'hyundai',
    model: 'grandeur',
    year: 2024,
    driverLimit: 'single' as const,
    ownDamage: 'join' as const,
    hasLaneSafety: true,
    hasForwardCollision: true,
    engine: 'g2_5',
    trim: 'premium',
  };

  const carBrand = car.brand || 'hyundai';
  const carModel = car.model || 'grandeur';
  const carYear = car.year || 2024;
  const carDriverLimit = car.driverLimit || 'single';
  const carOwnDamage = car.ownDamage || 'join';

  // 1. 차량 신차 가격 조회 및 엔진/트림 사양별 보정 가격 적용
  const dbModel = CAR_MODEL_MAP[carModel];
  const modelLabel = dbModel?.label || carModel;
  const brandLabel = CAR_DATABASE.find(b => b.id === carBrand)?.label || carBrand;
  const initialBasePrice = dbModel?.basePrice || 43000000;

  // 동적 엔진 및 트림 리스트 획득
  const engineOptions = getEngineOptions(dbModel?.type || 'sedan', carBrand, carModel);
  const trimOptions = getTrimOptions(dbModel?.type || 'sedan', carBrand, carModel);

  // 엔진 및 트림에 따른 가격 보정 적용
  let basePrice = initialBasePrice;
  const engineOpt = engineOptions.find(o => o.id === car.engine);
  if (engineOpt) basePrice += engineOpt.price;

  const trimOpt = trimOptions.find(o => o.id === car.trim);
  if (trimOpt) basePrice += trimOpt.price;

  // 차종 유형(SUV/RV vs 세단 vs 전기차 vs 수입차)에 따른 현실적 중고차 감가상각 요율 (보험개발원 및 중고차 시장 기준)
  const carType = dbModel?.type || 'sedan';
  let depreciationFactor = 0.88; // 일반 승용 세단: 연간 12% 감가상각 (잔가율 88%)
  if (carType === 'suv' || carType === 'van' || carType === 'truck') {
    depreciationFactor = 0.90; // SUV/RV/화물 (카니발, 쏘렌토 등 감가 방어 최상): 연간 10% 감가상각 (잔가율 90%)
  } else if (carType === 'ev' || carBrand === 'tesla') {
    depreciationFactor = 0.84; // 전기차 (중고 감가율 높음): 연간 16% 감가상각 (잔가율 84%)
  }

  const ageYears = Math.max(0, 2026 - carYear);
  const calculatedCarValue = Math.max(
    Math.round(basePrice * Math.pow(depreciationFactor, ageYears)),
    Math.round(basePrice * 0.1)
  );

  // 운전자 범위 할증 팩터
  const driverMultiplier = DRIVER_MULTIPLIERS[carDriverLimit] || 1.0;
  const driverLabel = DRIVER_LABELS[carDriverLimit] || '1인 한정';

  // 차종/제조사별 보험개발원(KIDI) 기준 수리비 등급 요율 현실적 반영 (자차 보험료 요율 현실화, 무사고 적용 대비 1.25배 스케일링)
  let ownDamageRate = 0.010; // 국산 일반 세단 기준 (1.0%)
  if (carType === 'suv' || carType === 'van' || carType === 'truck') {
    ownDamageRate = 0.01125; // 국산 대형 RV/SUV (수리 빈도 및 규모 반영) 기준 (1.125%)
  } else if (carType === 'ev' || carBrand === 'tesla') {
    ownDamageRate = 0.015625; // 전기차 (배터리 가산 반영) 기준 (1.5625%)
  } else if (carBrand === 'bmw' || carBrand === 'mercedes' || carBrand === 'audi' || carBrand === 'volvo' || carBrand === 'porsche') {
    ownDamageRate = 0.018125; // 수입 프리미엄 브랜드 (고가 공임 및 부품 반영) 기준 (1.8125%)
  }

  // 자차 가입 여부에 따른 최종 요율 보정
  const finalOwnDamageRate = carOwnDamage === 'join' ? ownDamageRate : carOwnDamage === 'exclude_single' ? ownDamageRate * 0.7 : 0;

  // ── 할인 특약 연산 ──
  let mileageDiscount = 0;
  if (car.annualMileage === 'under_3k') mileageDiscount = 0.35;
  else if (car.annualMileage === 'under_5k') mileageDiscount = 0.27;
  else if (car.annualMileage === 'under_10k') mileageDiscount = 0.18;

  let tmapDiscount = 0;
  if (car.safeDrivingScore === 'over_80') tmapDiscount = 0.12;
  else if (car.safeDrivingScore === 'under_80') tmapDiscount = 0.07;

  const connectedDiscount = car.hasConnectedCar ? 0.07 : 0;
  const blackboxDiscount = car.hasBlackbox ? 0.05 : 0;
  const childDiscount = car.hasChildRider ? 0.08 : 0;

  // 첨단 안전장치 할인 추가
  const laneSafetyDiscount = car.hasLaneSafety ? 0.03 : 0;
  const forwardCollisionDiscount = car.hasForwardCollision ? 0.04 : 0;

  // 무사고 우량할인 특약 할인율 적용
  let noAccidentDiscount = 0;
  if (car.noAccidentYears === '1year') noAccidentDiscount = 0.08;
  else if (car.noAccidentYears === '3years') noAccidentDiscount = 0.13;
  else if (car.noAccidentYears === '5years') noAccidentDiscount = 0.20;

  // 티맵 ↔ 커넥티드카 상호 배타 (최댓값 1개 선택)
  const driveDiscount = Math.max(tmapDiscount, connectedDiscount);
  const totalDiscountRate = mileageDiscount + driveDiscount + blackboxDiscount + childDiscount + laneSafetyDiscount + forwardCollisionDiscount + noAccidentDiscount;

  // ── 점수 진단 ──
  let propertyScore = 50;
  if (car.currentPropertyLimit >= 10) propertyScore = 95;
  else if (car.currentPropertyLimit >= 5) propertyScore = 85;
  else if (car.currentPropertyLimit >= 3) propertyScore = 75;
  else if (car.currentPropertyLimit >= 2) propertyScore = 65;

  const injuryScore = car.currentInjuryType === 'jasang' ? 95 : 45;
  const riderScore  = Math.min(100, Math.round((totalDiscountRate / 0.65) * 100));
  const totalScore  = Math.round((propertyScore + injuryScore + riderScore) / 3);

  // ── 긴급 보강 필요 항목 ──
  const deficiencies: string[] = [];
  if (car.currentInjuryType === 'jason') {
    deficiencies.push(
      '자기신체사고(자손) 가입: 사고 시 휴업손해·위자료 없이 치료비만 등급별로 제한 지급됩니다.'
    );
  }
  if (car.currentPropertyLimit < 5) {
    deficiencies.push(
      `대물배상 ${car.currentPropertyLimit}억 부족: 고가 수입차 다중 추돌 시 개인 변제 한도 초과 위험.`
    );
  }
  if (carOwnDamage === 'none') {
    deficiencies.push(
      `자차 미가입: 단독사고·침수 시 차량가액 ${Math.round(calculatedCarValue / 10000).toLocaleString()}만 원 전액 본인 부담.`
    );
  }
  if (carDriverLimit === 'single' && car.hasChildRider) {
    deficiencies.push(
      '1인 한정 + 자녀 할인 특약: 자녀가 운전하는 경우 보장에서 제외될 수 있습니다. 가족 한정으로 변경을 권장합니다.'
    );
  }
  if (!car.hasConnectedCar && car.safeDrivingScore === 'none') {
    deficiencies.push(
      '안전운전 특약 누락: 티맵/커넥티드카 연동 시 연 최대 12% 캐시백 환급 특약이 비활성화 상태입니다.'
    );
  }

  // 엔진/트림 사양 이름 한글화 포맷팅
  const engineLabel = engineOptions.find(o => o.id === car.engine)?.label || '기본형 엔진';
  const trimLabel = trimOptions.find(o => o.id === car.trim)?.label || '기본 등급';

  // 연령대 요율 계수 산출 (만 나이 기준)
  const age = analysis.age || 35;
  let ageMultiplier = 1.0;
  if (age < 21) ageMultiplier = 2.8;
  else if (age < 24) ageMultiplier = 2.0;
  else if (age < 26) ageMultiplier = 1.4;
  else if (age < 30) ageMultiplier = 1.0;
  else if (age < 43) ageMultiplier = 0.88;
  else if (age < 50) ageMultiplier = 0.78;
  else if (age < 65) ageMultiplier = 0.85;
  else ageMultiplier = 0.95;

  // 성별 요율 계수 산출 (연령별 통계적 간접 요율 반영)
  const gender = analysis.gender || 'M';
  let genderMultiplier = 1.0;
  if (age < 30) {
    genderMultiplier = gender === 'M' ? 1.04 : 0.98;
  } else if (age < 60) {
    genderMultiplier = gender === 'M' ? 1.00 : 1.03;
  }

  // ── 플랜별 보험료 계산 (보험개발원 기준 차종별 현실화 요율 적용) ──
  // 기준: 40대 무사고 다이렉트 연간 순보험료 (할인 전)
  let basePremium = 830000;  // 일반 승용 세단 기준 (소나타·그랜저 등 중대형)
  if (carType === 'hatchback') basePremium = 650000;         // 경차/소형 해치백 (모닝·캐스퍼 등)
  else if (carType === 'suv' || carType === 'van' || carType === 'truck') basePremium = 960000; // 국산 대형 SUV/RV/밴 (카니발 등)
  else if (carType === 'ev' || carBrand === 'tesla') basePremium = 1170000;  // 전기차 (아이오닉·테슬라 등)
  else if (carBrand === 'bmw' || carBrand === 'mercedes' || carBrand === 'audi' || carBrand === 'volvo') basePremium = 1620000; // 수입 프리미엄 세단 (BMW·벤츠·아우디 등)
  else if (carBrand === 'porsche') basePremium = 3600000;    // 수입 스포츠카 (포르쉐 등)

  // 업무용 차량은 보험 개발원 기준 할증 20% 반영
  if (car.subType === 'business') {
    basePremium = Math.round(basePremium * 1.20);
  }

  // 연령 및 성별 요율 적용
  basePremium = Math.round(basePremium * ageMultiplier * genderMultiplier);

  const initialPremium = basePremium * driverMultiplier;

  const calculatePlanPremium = (ownDamageType: 'join' | 'exclude_single' | 'none', propLimit: number, injuryType: 'jason' | 'jasang') => {
    let rate = ownDamageRate;
    if (ownDamageType === 'exclude_single') rate *= 0.7;
    else if (ownDamageType === 'none') rate = 0;
    
    const ownDamagePrem = calculatedCarValue * rate;
    
    let coveragePrem = 50000; // 대인배상II 무한 + 대물 2억 기본 커버리지 (기본 순보험료에 대부분 포함됨)
    if (propLimit >= 10) coveragePrem += 30000;  // 대물 10억 확장
    else if (propLimit >= 5) coveragePrem += 15000; // 대물 5억 확장
    
    if (injuryType === 'jasang') coveragePrem += 30000; // 자동차상해(자상) 프리미엄
    
    let totalPlanPrem = initialPremium + ownDamagePrem + coveragePrem;
    const discount = 1 - Math.min(0.50, totalDiscountRate - mileageDiscount); // 마일리지는 가입 시 선할인이 아닌 사후 환급이므로 가입 시 결제금액 기준(마일리지 할인 제외)으로 계산
    return Math.round((totalPlanPrem * discount) / 12);
  };

  const calculateUndiscountedPlanPremium = (ownDamageType: 'join' | 'exclude_single' | 'none', propLimit: number, injuryType: 'jason' | 'jasang') => {
    let rate = ownDamageRate;
    if (ownDamageType === 'exclude_single') rate *= 0.7;
    else if (ownDamageType === 'none') rate = 0;
    
    const ownDamagePrem = calculatedCarValue * rate;
    
    let coveragePrem = 50000; // 대인배상II 무한 + 대물 2억 기본 커버리지 (기본 순보험료에 대부분 포함됨)
    if (propLimit >= 10) coveragePrem += 30000;  // 대물 10억 확장
    else if (propLimit >= 5) coveragePrem += 15000; // 대물 5억 확장
    
    if (injuryType === 'jasang') coveragePrem += 30000; // 자동차상해(자상) 프리미엄
    
    let totalPlanPrem = initialPremium + ownDamagePrem + coveragePrem;
    const discount = 1 - Math.min(0.50, totalDiscountRate - mileageDiscount); // 실질 최대 할인 50% 상한
    return Math.round((totalPlanPrem * discount) / 12);
  };

  const dietPremium = calculatePlanPremium('none', 2, 'jason');
  const hybridPremium = calculatePlanPremium('exclude_single', 5, 'jasang');
  const upgradePremium = calculatePlanPremium('join', 10, 'jasang');

  const undiscountedDietPremium = calculateUndiscountedPlanPremium('none', 2, 'jason');
  const undiscountedHybridPremium = calculateUndiscountedPlanPremium('exclude_single', 5, 'jasang');
  const undiscountedUpgradePremium = calculateUndiscountedPlanPremium('join', 10, 'jasang');
  const monthlyOriginal = analysis.monthlyPremium || 80000;
  const savingsPercent = Math.max(0, Math.round((1 - hybridPremium / monthlyOriginal) * 100));

  const deviations = [
    { companyName: 'AXA손해보험', productName: '다이렉트 자동차보험', finalDev: 582240 / 711150, payDev: 736900 / 711150 },
    { companyName: '하나손해보험', productName: '하나 다이렉트 자동차보험', finalDev: 597850 / 711150, payDev: 633440 / 711150 },
    { companyName: '롯데손해보험', productName: 'let:click 개인용자동차보험(인터넷)', finalDev: 606060 / 711150, payDev: 611930 / 711150 },
    { companyName: '흥국화재', productName: '이유인터넷개인용자동차보험', finalDev: 607530 / 711150, payDev: 687900 / 711150 },
    { companyName: '메리츠화재', productName: '메리츠화재 다이렉트 자동차보험(CM)', finalDev: 643430 / 711150, payDev: 656170 / 711150 },
    { companyName: 'KB손해보험', productName: 'KB다이렉트(플랫폼)개인용자동차보험', finalDev: 658890 / 711150, payDev: 724870 / 711150 },
    { companyName: '한화손해보험', productName: '캐롯 자동차보험', finalDev: 699920 / 711150, payDev: 708880 / 711150 },
    { companyName: 'DB손해보험', productName: '프로미카 다이렉트개인용자동차보험(플랫폼)', finalDev: 711150 / 711150, payDev: 780100 / 711150 },
    { companyName: '삼성화재', productName: '개인용애니카다이렉트자동차보험(플랫폼)', finalDev: 718360 / 711150, payDev: 725420 / 711150 },
    { companyName: '현대해상', productName: 'Hicar 다이렉트 개인용자동차보험(플랫폼)', finalDev: 806160 / 711150, payDev: 856370 / 711150 }
  ];

  const allOptions = deviations.map(d => ({
    companyName: d.companyName,
    productName: d.productName,
    premium: Math.round(hybridPremium * d.finalDev),
    paymentPremium: Math.round(hybridPremium * d.payDev)
  })).sort((a, b) => a.premium - b.premium);

  const result: AnalysisResult = {
    analysis: {
      ...analysis,
      _allOptions: allOptions,
      monthlyPremium: hybridPremium
    },
    scores: {
      cancerScore: propertyScore,         // 대물배상 점수 (우회 매핑)
      cerebrovascularScore: injuryScore,   // 상해보장 점수
      cardiovascularScore: riderScore,     // 할인특약 점수
      totalScore,
    },
    efficiency: savingsPercent,
    deficiencies,
    undiscountedPremiums: {
      diet: undiscountedDietPremium,
      hybrid: undiscountedHybridPremium,
      upgrade: undiscountedUpgradePremium,
    },
    recommendations: {
      diet: {
        title: '실속 다이어트 플랜',
        description: `마일리지·다이렉트 초저가 특약 집중 적용으로 월 보험료를 극도로 낮춘 실속형입니다.`,
        estimatedPremium: Math.round(dietPremium * 0.97),
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}, ${carYear}년식) 차량가액 ${Math.round(calculatedCarValue / 10000).toLocaleString()}만 원 반영`,
          `운전자 범위: ${driverLabel}`,
          '마일리지 주행거리 할인 최대 35% 즉시 연계',
          '블랙박스·차선이탈·전방충돌 안전운전 특약 최저가 조합',
        ],
        switchingLossNotice: '불필요한 마케팅 수수료를 제거하여 연간 보험료 지출을 최대 30% 다이어트합니다.',
        companyName: '메리츠화재',
        productName: '다이렉트 메리츠 자동차보험 (실속)',
      },
      upgrade: {
        title: '대물 10억 + 자상 프리미엄 플랜',
        description: `사고 시 탑승자 및 보행 중 가족까지 100% 보장하는 최고급형 안심 포트폴리오입니다.`,
        estimatedPremium: Math.round(upgradePremium * 1.02),
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}, ${carYear}년식) 자차손해 완전 보장`,
          `운전자 범위: ${driverLabel} → 풀 커버리지 업그레이드`,
          '대물배상 기존 1~2억 ➔ 10억 확장',
          '자기신체사고(자손) ➔ 자동차상해(자상) 전격 교체',
          '무보험차상해 2억 ➔ 5억 확장 + 긴급출동 60km',
        ],
        switchingLossNotice: '커피 한 잔 가격 차이로 사고 리스크를 완벽하게 제로화합니다.',
        companyName: '삼성화재',
        productName: '다이렉트 애니카 자동차보험 (프리미엄)',
      },
      hybrid: {
        title: '가성비 밸런스 추천 플랜',
        description: `대물 5억 + 자상 가성비형으로 가격과 보장의 균형을 완벽하게 잡은 추천 플랜입니다.`,
        estimatedPremium: Math.round(hybridPremium * 1.00),
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}) — 단독사고 제외 자차 절약형`,
          `운전자 범위: ${driverLabel}`,
          '대물배상 5억 안정적 라인 구축',
          '자동차상해(자상 사망 1억/부상 2천) 가성비형',
          'Tmap 연계 최대 추가 캐시백 및 차선/전방 안전 특약 연동',
        ],
        switchingLossNotice: '가장 많은 고객이 선택하는 밸런스 플랜, 가격 대비 최대 효율 지수를 제공합니다.',
        companyName: 'DB손해보험',
        productName: '다이렉트 프로미 자동차보험 (가성비)',
      },
    },
  };

  return result;
};
