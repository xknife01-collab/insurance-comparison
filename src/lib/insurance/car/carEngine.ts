import { InsuranceAnalysis, AnalysisResult } from '../../../types/insurance';
import { fetchCarPremium } from './carLoader';
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

  // 차종/제조사별 보험개발원(KIDI) 기준 수리비 등급 요율 현실적 반영
  let ownDamageRate = 0.0165; // 국산 일반 세단 기준 (1.65%)
  if (carType === 'suv' || carType === 'van' || carType === 'truck') {
    ownDamageRate = 0.0185; // 국산 대형 RV/SUV (수리 빈도 및 규모가 큼) 기준 (1.85%)
  } else if (carType === 'ev' || carBrand === 'tesla') {
    ownDamageRate = 0.0225; // 전기차 (배터리 교체비 가산) 기준 (2.25%)
  } else if (carBrand === 'bmw' || carBrand === 'mercedes' || carBrand === 'audi' || carBrand === 'volvo' || carBrand === 'porsche') {
    ownDamageRate = 0.0235; // 수입 프리미엄 브랜드 (고가 부품 및 공임 가산) 기준 (2.35%)
  }

  // 자차 가입 여부에 따른 최종 요율 보정
  const finalOwnDamageRate = carOwnDamage === 'join' ? ownDamageRate : carOwnDamage === 'exclude_single' ? ownDamageRate * 0.7 : 0;
  const ownDamagePremiumAnnual = Math.round(calculatedCarValue * finalOwnDamageRate * driverMultiplier);

  // 기본 책임보험 요율 취득 (나이/성별 기반)
  const rates = await fetchCarPremium(analysis.age, analysis.gender);

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

  // 티맵 ↔ 커넥티드카 상호 배타 (최댓값 1개 선택)
  const driveDiscount = Math.max(tmapDiscount, connectedDiscount);
  const totalDiscountRate = mileageDiscount + driveDiscount + blackboxDiscount + childDiscount + laneSafetyDiscount + forwardCollisionDiscount;

  // ── 회사별 요율 정렬 → Diet / Hybrid / Upgrade 플랜 매핑 ──
  const sortedRates = [...rates].sort((a, b) => a.basePremium - b.basePremium);
  const bestRate  = sortedRates[0];
  const midRate   = sortedRates[Math.floor(sortedRates.length / 2)];
  const brandRate = sortedRates[sortedRates.length - 1];

  // ── 플랜별 연간 → 월 환산 보험료 ──
  // 운전자 범위 할증을 기본 책임보험에도 반영 (단독=0%, 부부=+15% 등)
  const baseDiet    = Math.round(bestRate.basePremium  * (1 - totalDiscountRate) * driverMultiplier);
  const baseHybrid  = Math.round(midRate.basePremium   * (1 - totalDiscountRate * 0.95) * driverMultiplier + 15000);
  const baseUpgrade = Math.round(brandRate.basePremium * (1 - totalDiscountRate * 0.9)  * driverMultiplier + 45000);

  const dietPremium    = Math.round((baseDiet    + ownDamagePremiumAnnual) / 12);
  const hybridPremium  = Math.round((baseHybrid  + Math.round(ownDamagePremiumAnnual * 0.9)) / 12);
  const upgradePremium = Math.round((baseUpgrade + ownDamagePremiumAnnual) / 12);

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

  // ── 결과 조립 ──
  const result: AnalysisResult = {
    analysis,
    scores: {
      cancerScore: propertyScore,         // 대물배상 점수 (우회 매핑)
      cerebrovascularScore: injuryScore,   // 상해보장 점수
      cardiovascularScore: riderScore,     // 할인특약 점수
      totalScore,
    },
    efficiency: Math.round((totalScore / Math.max(analysis.monthlyPremium || 80000, 1)) * 75000),
    deficiencies,
    recommendations: {
      diet: {
        title: '실속 다이어트 플랜',
        description: `마일리지·다이렉트 초저가 특약 집중 적용으로 월 보험료를 극도로 낮춘 실속형입니다. (${bestRate.companyName} 기준)`,
        estimatedPremium: dietPremium,
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}, ${carYear}년식) 차량가액 ${Math.round(calculatedCarValue / 10000).toLocaleString()}만 원 반영`,
          `운전자 범위: ${driverLabel}`,
          '마일리지 주행거리 할인 최대 35% 즉시 연계',
          '블랙박스·차선이탈·전방충돌 안전운전 특약 최저가 조합',
        ],
        switchingLossNotice: '불필요한 마케팅 수수료를 제거하여 연간 보험료 지출을 최대 30% 다이어트합니다.',
        companyName: bestRate.companyName,
        productName: bestRate.productName,
      },
      upgrade: {
        title: '대물 10억 + 자상 프리미엄 플랜',
        description: `사고 시 탑승자 및 보행 중 가족까지 100% 보장하는 최고급형 안심 포트폴리오입니다. (${brandRate.companyName} 기준)`,
        estimatedPremium: upgradePremium,
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}, ${carYear}년식) 자차손해 완전 보장`,
          `운전자 범위: ${driverLabel} → 풀 커버리지 업그레이드`,
          '대물배상 기존 1~2억 ➔ 10억 확장',
          '자기신체사고(자손) ➔ 자동차상해(자상) 전격 교체',
          '무보험차상해 2억 ➔ 5억 확장 + 긴급출동 60km',
        ],
        switchingLossNotice: '커피 한 잔 가격 차이로 사고 리스크를 완벽하게 제로화합니다.',
        companyName: brandRate.companyName,
        productName: brandRate.productName,
      },
      hybrid: {
        title: '가성비 밸런스 추천 플랜',
        description: `대물 5억 + 자상 가성비형으로 가격과 보장의 균형을 완벽하게 잡은 추천 플랜입니다. (${midRate.companyName} 기준)`,
        estimatedPremium: hybridPremium,
        coverageChanges: [
          `${brandLabel} ${modelLabel} (${engineLabel} ${trimLabel}) — 단독사고 제외 자차 절약형`,
          `운전자 범위: ${driverLabel}`,
          '대물배상 5억 안정적 라인 구축',
          '자동차상해(자상 사망 1억/부상 2천) 가성비형',
          'Tmap 연계 최대 추가 캐시백 및 차선/전방 안전 특약 연동',
        ],
        switchingLossNotice: '가장 많은 고객이 선택하는 밸런스 플랜, 가격 대비 최대 효율 지수를 제공합니다.',
        companyName: midRate.companyName,
        productName: midRate.productName,
      },
    },
  };

  return result;
};
