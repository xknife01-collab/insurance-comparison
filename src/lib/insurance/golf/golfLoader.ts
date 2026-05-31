import { InsuranceAnalysis } from '../../../types/insurance';

export interface GolfProduct {
  company: string;
  productName: string;
  basePremium: number; // 1년형 기준 기본 보험료 (원)
}

export const GOLF_PRODUCTS: GolfProduct[] = [
  { company: '흥국생명', productName: '(무)처음만난흥국생명상해보험', basePremium: 3000 },
  { company: 'DB손보', productName: '(무)다이렉트 오잘공 골프보험2601(CM)', basePremium: 5520 },
  { company: '한화손보', productName: '한화 다이렉트 홀인원보험 (무)2601', basePremium: 6011 },
  { company: 'DB생명', productName: '(무)백년친구 생활보험(2602)(3종:레저보장형)', basePremium: 10100 },
  { company: '삼성화재', productName: '삼성화재 다이렉트 착한골프보험', basePremium: 9500 },
  { company: '현대해상', productName: '현대해상 다이렉트 골프보험', basePremium: 10800 },
];

export const fetchGolfPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const golfOpts = analysis.golf || {
    gameType: 'amateur',
    planType: 'annual',
    durationDays: 365,
    isGroup: false,
    companionNames: [],
    hasHoleInOneRider: true,
    hasLiabilityRider: true,
    hasEquipmentRider: true,
  };

  // 1. 경기 유형 (gameType) 보정
  // 프로/지도자는 골프 중 사고 리스크가 높아 요율이 높으나(1.5배), 홀인원/용품 보장은 제외 또는 축소되므로 특약 추가금이 0원으로 설계됨.
  const gameMultiplier = golfOpts.gameType === 'professional' ? 1.5 : 1.0;

  // 2. 가입 유형 (planType) 및 기간 일수 보정
  // 원데이(1일)는 1년형에 비해 하루 보험료가 높지만 절대 금액은 매우 저렴(1년형의 약 20% 수준)
  let planMultiplier = 1.0;
  if (golfOpts.planType === 'one_day') {
    planMultiplier = 0.20; // 약 2,000원 ~ 2,500원대
  }

  // 3. 연령대별 가중치 (40세 기준 - 원데이는 나이 무관 동일 가격 적용)
  let ageMultiplier = 1.0;
  if (golfOpts.planType !== 'one_day') {
    const age = analysis.age || 40;
    if (age < 30) ageMultiplier = 0.90;
    else if (age <= 49) ageMultiplier = 1.0;
    else if (age <= 65) ageMultiplier = 1.15;
    else ageMultiplier = 1.30;
  }

  // 4. 성별 가중치 (남성이 골프 중 상해 리스크 및 홀인원 발생 확률/경기 횟수가 높은 편 - 원데이는 성별 무관 동일 가격 적용)
  const genderMultiplier = golfOpts.planType === 'one_day' ? 1.0 : (analysis.gender === 'F' ? 0.90 : 1.0);

  // 5. 특약 가중 비용 누적
  // 프로 선수는 특약 가입이 불가능하거나 비용이 청구되지 않음
  let riderCost = 0;
  if (golfOpts.gameType === 'amateur') {
    if (golfOpts.hasHoleInOneRider) riderCost += 3000;
    if (golfOpts.hasLiabilityRider) riderCost += 1500;
    if (golfOpts.hasEquipmentRider) riderCost += 2500;
  }

  // 6. 단체 가입 (4인 동반) 5% 할인 적용
  const groupDiscount = golfOpts.isGroup ? 0.95 : 1.0;

  // 최종 요율 계수 곱
  const combinedMultiplier = gameMultiplier * planMultiplier * ageMultiplier * genderMultiplier * groupDiscount;

  // 각 보험사별로 최종 가상 보험료 계산
  const results = GOLF_PRODUCTS.map(p => {
    const rawPremium = p.basePremium * combinedMultiplier + riderCost;
    const finalPremium = Math.round(rawPremium / 100) * 100; // 100원 단위 절사

    // 특약 한도 매핑 정보
    let details: Record<string, string> = {
      '홀인원 비용': golfOpts.gameType === 'professional' ? '보장 제외(가입불가)' : (golfOpts.hasHoleInOneRider ? '회당 100~200만 원 실비' : '미보장'),
      '배상책임 한도': golfOpts.hasLiabilityRider ? '사고당 2,000만 원 (자부담 2만)' : '미보장',
      '골프용품 손해': golfOpts.gameType === 'professional' ? '보장 제외(가입불가)' : (golfOpts.hasEquipmentRider ? '세트당 100만 원 한도' : '미보장'),
      '골프 중 상해사망': '최대 1억 원 보장',
    };

    return {
      premium: finalPremium,
      productName: p.productName,
      companyName: p.company,
      planLevel: golfOpts.planType === 'one_day' ? '원데이형' : '연간회원형',
      details
    };
  });

  // 보험료 순 오름차순 정렬
  results.sort((a, b) => a.premium - b.premium);

  const mainOption = results[0];

  return {
    premium: mainOption.premium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
