import { InsuranceAnalysis } from '../../../types/insurance';
import { createClient } from '../../../utils/supabase/client';

export interface FireProduct {
  company: string;
  productName: string;
  basePremium: number; // 아파트 84㎡ 기준 기본 보험료 (원)
}

export const FIRE_PRODUCTS: FireProduct[] = [
  { company: '메리츠화재', productName: '(무) 메리츠 우리집보험 M-House2601', basePremium: 733 },
  { company: '한화손보', productName: '한화 다이렉트 119주택화재보험 (무)2601', basePremium: 581 },
  { company: '삼성화재', productName: '무배당 삼성화재 다이렉트 주택화재종합보험(2601.15)', basePremium: 3701 },
  { company: '현대해상', productName: '(무)현대해상다이렉트H주택화재상해보험(Hi2601)', basePremium: 299 },
  { company: 'KB손보', productName: 'KB 다이렉트 주택화재보험(무배당)(26.01)', basePremium: 640 },
  { company: '하나손보', productName: '무배당 하나더퍼스트 화재보험(2601)', basePremium: 762 },
  { company: '에이스손보(라이나)', productName: '(무)우리집 무사고 할인보험2404 1종(순수보장형)', basePremium: 13280 },
  { company: '신한EZ손보', productName: '신한 이지로운 주택화재보험(무배당)', basePremium: 1255 },
  { company: '농협손보', productName: '(무) My리치하우스가정종합보험2601', basePremium: 1109 },
];

export const fetchFirePremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const rawOpts = (analysis.fire || {}) as any;
  const toNum = (val: any, fallback: number): number => {
    if (val === undefined || val === null) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  const fireOpts = {
    residenceType:            rawOpts.residenceType || 'apartment',
    occupancyType:            rawOpts.occupancyType || 'owner',
    buildingArea:             toNum(rawOpts.buildingArea, 84),
    structureGrade:           toNum(rawOpts.structureGrade, 1),
    hasWaterLeakRider:        rawOpts.hasWaterLeakRider ?? true,
    hasLiabilityRider:        rawOpts.hasLiabilityRider ?? true,
    hasTemporaryHousingRider: rawOpts.hasTemporaryHousingRider ?? true,
    householdGoodsLimit:      toNum(rawOpts.householdGoodsLimit, 30000000),
    buildingLimit:            toNum(rawOpts.buildingLimit, 100000000),
  };


  // 1. 주거 형태에 따른 가중치 및 기본료 보정
  let residenceMultiplier = 1.0;
  if (fireOpts.residenceType === 'villa') residenceMultiplier = 1.25;
  else if (fireOpts.residenceType === 'house') residenceMultiplier = 1.55;

  // 2. 거주 구분 (소유자 vs 세입자) 요율 보정
  // 세입자는 임차자배상책임이 저렴하지만 가재도구 비중이 큼. 소유자는 건물 화재 피해 리스크가 큼.
  const occupancyMultiplier = fireOpts.occupancyType === 'owner' ? 1.1 : 1.0;

  // 3. 건물 구조 등급 (1급: 콘크리트 1.0, 2급: 벽돌 1.25, 3급: 목조 1.6)
  let structureMultiplier = 1.0;
  if (Number(fireOpts.structureGrade) === 2) structureMultiplier = 1.25;
  else if (Number(fireOpts.structureGrade) === 3) structureMultiplier = 1.60;

  // 4. 건물 면적 비례 보정 (기본 84㎡ 기준, 1㎡당 0.5% 증감)
  const areaRatio = Math.max(0.5, Math.min(3.0, 1.0 + (fireOpts.buildingArea - 84) * 0.006));

  // 5. 가입금액 규모에 따른 화재 위험 보험료 직접 산출 (1000만 원당 단가 기준)
  // - 건물 화재 기본 단가: 1000만 원당 130원 (월납 환산)
  // - 가재도구 화재 기본 단가: 1000만 원당 160원 (월납 환산)
  const buildingRate = 130;
  const goodsRate = 160;

  const buildingBasePremium = (fireOpts.buildingLimit / 10000000) * buildingRate;
  const goodsBasePremium = (fireOpts.householdGoodsLimit / 10000000) * goodsRate;
  const baseFirePremium = buildingBasePremium + goodsBasePremium;

  // 6. 주거환경 요율 통합 (주거형태 * 거주구분 * 건물등급 * 면적비율)
  const environmentalMultiplier = residenceMultiplier * occupancyMultiplier * structureMultiplier * areaRatio;

  // 7. 가액 규모별 할인 적용 (초고가 주택 등에 적용되는 1차손해/감액 요율 시뮬레이션)
  // - 가입금액이 커질수록 1000만원당 적용 위험요율이 완만히 감소
  const discountFactor = fireOpts.buildingLimit > 0 
    ? Math.max(0.4, Math.pow(fireOpts.buildingLimit / 100000000, -0.18)) 
    : 1.0;
  
  // 최종 위험 보험료 (보험사 요율 미반영 상태)
  const adjustedFirePremium = baseFirePremium * environmentalMultiplier * discountFactor;

  // 데이터베이스에서 실제 상품별 베이스 프리미엄 가져오기 (시도)
  let dbBasePremiums: Record<string, number> = {};
  try {
    const supabase = createClient();
    const { data: dbRates } = await supabase
      .from('insurance_fire_rates')
      .select('company_name, product_name, base_premium');

    if (dbRates && dbRates.length > 0) {
      dbRates.forEach(row => {
        if (row.product_name && row.base_premium) {
          dbBasePremiums[row.product_name.trim()] = Number(row.base_premium);
        }
        if (row.company_name && row.base_premium) {
          dbBasePremiums[row.company_name.trim()] = Number(row.base_premium);
        }
      });
    }
  } catch (err) {
    console.warn('[FireLoader] DB rates not found, falling back to local defaults.', err);
  }

  // 각 보험사별로 최종 가상 보험료 계산
  const results = FIRE_PRODUCTS.map(p => {
    const base = dbBasePremiums[p.productName.trim()] || dbBasePremiums[p.company.trim()] || p.basePremium;
    
    // 가족화재벌금 데이터(base)를 보험사 브랜드 가격 격차용 팩터로 치환 (평균 벌금 보험료 700원 기준)
    // 에이스손보처럼 베이스가 높게 산출된 특이 케이스는 로그 스케일링으로 보정
    let companyFactor = base / 700;
    if (companyFactor > 3.0) {
      companyFactor = 3.0 + Math.log(companyFactor - 2.0);
    }

    // 8. 특약별 비용 산정 (건물 규모 및 소유구분에 비례해 차별화)
    let companyRiderCost = 0;
    if (fireOpts.hasWaterLeakRider) {
      companyRiderCost += 2200; // 급배수시설누출손해
    }
    if (fireOpts.hasLiabilityRider) {
      // 대형/고급 주택일수록 책임배상 한도 상향 및 보험료 할증
      if (fireOpts.buildingLimit >= 5000000000) {
        companyRiderCost += 4200; // 대물 50억 수준
      } else if (fireOpts.buildingLimit >= 1000000000) {
        companyRiderCost += 2800; // 대물 30억 수준
      } else {
        companyRiderCost += 1400; // 대물 20억 수준
      }
    }
    if (fireOpts.hasTemporaryHousingRider) {
      // 건물 가치에 비례해 임시 거주비 물가 보정 적용 (최대 5000원)
      const housingRiderScale = Math.min(5.0, 1.0 + (fireOpts.buildingLimit - 100000000) / 100000000 * 0.15);
      companyRiderCost += Math.round(800 * housingRiderScale);
    }

    const rawPremium = adjustedFirePremium * companyFactor + companyRiderCost;
    const finalPremium = Math.round(rawPremium / 100) * 100; // 100원 단위 절사
    const paidPremium = Math.max(10000, finalPremium); // 최저보험료 1만 원 적용

    // 건물 및 대물 배상책임 한도 한글 라벨링 처리
    const bLimitText = fireOpts.buildingLimit === 0
      ? '미가입'
      : fireOpts.buildingLimit >= 100000000
        ? `${(fireOpts.buildingLimit / 100000000).toFixed(0)}억 원`
        : `${(fireOpts.buildingLimit / 10000000).toFixed(0)}천만 원`;

    const gLimitText = fireOpts.householdGoodsLimit >= 100000000
      ? `${(fireOpts.householdGoodsLimit / 100000000).toFixed(0)}억 원`
      : `${(fireOpts.householdGoodsLimit / 10000000).toFixed(0)}천만 원`;

    let liabilityLabelText = '미보장';
    if (fireOpts.hasLiabilityRider) {
      if (fireOpts.occupancyType === 'tenant') {
        liabilityLabelText = '임차자 배상 1억 한도';
      } else {
        if (fireOpts.buildingLimit >= 5000000000) {
          liabilityLabelText = '대물 50억 / 대인 1.5억';
        } else if (fireOpts.buildingLimit >= 1000000000) {
          liabilityLabelText = '대물 30억 / 대인 1.5억';
        } else {
          liabilityLabelText = '대물 20억 / 대인 1.5억';
        }
      }
    }

    const detailDetails: Record<string, string> = {
      '건물 소실 손해': fireOpts.buildingLimit === 0 ? '미가입' : `${bLimitText} 실손보상`,
      '가재도구 손해': `${gLimitText} 실손보상`,
      '급배수 누수손해': fireOpts.hasWaterLeakRider ? '최대 500만 원 한도 (아랫집 포함)' : '미보장',
      '화재 배상책임': liabilityLabelText,
      '임시 거주비': fireOpts.hasTemporaryHousingRider ? '일당 10만 원 (최대 90일)' : '미보장',
      '최저보험료 룰': `실 납입 10,000원 (적립금 전환)`,
    };

    return {
      premium: paidPremium,
      riskPremium: finalPremium,
      savingsPremium: Math.max(0, 10000 - finalPremium),
      productName: p.productName,
      companyName: p.company,
      planLevel: fireOpts.occupancyType === 'owner' ? '소유자 안심플랜' : '임차인 실속플랜',
      details: detailDetails
    };
  });

  // 순수 보장(위험) 보험료 오름차순 정렬 (가성비 순 정렬)
  results.sort((a, b) => a.riskPremium - b.riskPremium);

  const mainOption = results[0];

  return {
    premium: mainOption.premium,
    riskPremium: mainOption.riskPremium,
    savingsPremium: mainOption.savingsPremium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
