import { InsuranceAnalysis } from '../../../types/insurance';
import { createClient } from '../../../utils/supabase/client';

export interface PropertyProduct {
  company: string;
  productName: string;
  premiumMale: number;
  premiumFemale: number;
}

export const FALLBACK_PROPERTY_PRODUCTS: PropertyProduct[] = [
  { company: '메리츠화재', productName: '(무) 메리츠 재물보험 성공메이트2601(1종)', premiumMale: 17950, premiumFemale: 16850 },
  { company: '메리츠화재', productName: '(무) 메리츠 재물보험 성공메이트2601(2종)', premiumMale: 23612, premiumFemale: 22062 },
  { company: '한화손보', productName: '성공하는 Owner 재산종합보험 (무)2601', premiumMale: 8688, premiumFemale: 8688 },
  { company: '한화손보', productName: '한화 BigPlus 재산종합보험 (무)2601', premiumMale: 1731, premiumFemale: 1731 },
  { company: '롯데손보', productName: '(무) let:care 재물종합보험(2601)', premiumMale: 2766, premiumFemale: 2766 },
  { company: '롯데손보', productName: '(무) let:care 화재배상책임보험(2601)', premiumMale: 830, premiumFemale: 830 },
  { company: '흥국화재', productName: '무배당 흥Good 행복든든 재산종합보험(26.03)_1종', premiumMale: 2738, premiumFemale: 2738 },
  { company: '흥국화재', productName: '무배당 흥Good 행복든든 재산종합보험(26.03)_2종', premiumMale: 2438, premiumFemale: 2438 },
  { company: '삼성화재', productName: '무배당 삼성화재 재물보험 비즈앤안전 파트너(2601.8)', premiumMale: 10043, premiumFemale: 6743 },
  { company: '삼성화재', productName: '무배당 삼성화재 재물보험 수퍼비즈니스(BOP)(2601.22)', premiumMale: 21322, premiumFemale: 17922 },
  { company: '삼성화재', productName: '무배당 삼성화재 다이렉트 사업장 화재보험(2601.7)', premiumMale: 13317, premiumFemale: 13317 },
  { company: '삼성화재', productName: '무배당 삼성화재 재물보험 성공예감(2601.14)', premiumMale: 6205, premiumFemale: 4605 },
  { company: '현대해상', productName: '(무)현대해상성공마스터재산종합보험(Hi2601) 2종', premiumMale: 1910, premiumFemale: 1910 },
  { company: '현대해상', productName: '(무)현대해상성공마스터재산종합보험(Hi2601) 1종', premiumMale: 1908, premiumFemale: 1908 },
  { company: 'KB손보', productName: 'KB 다이렉트 사업장종합보험(무배당)(26.01)', premiumMale: 7465, premiumFemale: 7465 },
  { company: 'KB손보', productName: 'KB 홈앤비즈케어종합보험(무배당)(26.01)_2종(비즈케어)', premiumMale: 5975, premiumFemale: 5975 },
  { company: 'KB손보', productName: 'KB 홈앤비즈케어종합보험(무배당)(26.01)_1종(홈케어)', premiumMale: 643, premiumFemale: 643 },
  { company: 'DB손보', productName: '(무)참좋은화재플러스보장보험2601', premiumMale: 1885, premiumFemale: 1885 },
  { company: 'DB손보', productName: '(무)참좋은화재든든보장보험2601', premiumMale: 1885, premiumFemale: 1885 },
  { company: 'DB손보', productName: '(무)드림빅비즈니스보장보험2601(1종)', premiumMale: 26592, premiumFemale: 26592 },
  { company: 'DB손보', productName: '(무)드림빅비즈니스보장보험2601(2종)', premiumMale: 97490, premiumFemale: 82750 },
  { company: 'AXA손보', productName: '(무)AXA생활안심종합보험Ⅱ2601', premiumMale: 3100, premiumFemale: 3100 },
  { company: '농협손보', productName: '(무) NH승승장구재산종합보험2601', premiumMale: 15719, premiumFemale: 15719 },
];

export const fetchPropertyPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const propOpts = analysis.property || {
    businessType: 'restaurant',
    buildingGrade: 'grade_1',
    buildingLimit: 200000000,
    interiorLimit: 50000000,
    equipmentLimit: 30000000,
    inventoryLimit: 20000000,
    hasWaterLeak: true,
    hasPremisesLiability: true,
    hasBusinessInterruption: false,
    hasFoodLiability: true,
    hasMachineryBreakdown: false
  };

  const isMale = analysis.gender === 'M';

  // 1. Supabase에서 실시간 요율 데이터 조회
  let dbProducts: PropertyProduct[] = [];
  try {
    const supabase = createClient();
    const { data: dbRates } = await supabase
      .from('insurance_property_rates')
      .select('company_name, product_name, division, premium_male, premium_female')
      .eq('division', '주계약');

    if (dbRates && dbRates.length > 0) {
      const seen = new Set<string>();
      dbRates.forEach(row => {
        const key = `${row.company_name}_${row.product_name}`;
        if (!seen.has(key)) {
          seen.add(key);
          dbProducts.push({
            company: row.company_name,
            productName: row.product_name,
            premiumMale: Number(row.premium_male) || 10000,
            premiumFemale: Number(row.premium_female) || 10000
          });
        }
      });
    }
  } catch (err) {
    console.warn('[PropertyLoader] DB rates lookup failed. Using local fallback.', err);
  }

  const activeProducts = dbProducts.length > 0 ? dbProducts : FALLBACK_PROPERTY_PRODUCTS;

  // 2. 가입 금액 합산 및 비례 계수 계산 (표준설계 기준 2억 원 대비 비율)
  const totalAssets = propOpts.buildingLimit + propOpts.interiorLimit + propOpts.equipmentLimit + propOpts.inventoryLimit;
  const assetRatio = Math.max(0.1, totalAssets / 200000000);

  // 3. 업종 유형별 가중치 설정
  let businessMultiplier = 0.8; // office 기본
  if (propOpts.businessType === 'retail') businessMultiplier = 1.0;
  else if (propOpts.businessType === 'academy') businessMultiplier = 0.9;
  else if (propOpts.businessType === 'restaurant') businessMultiplier = 1.4;
  else if (propOpts.businessType === 'warehouse') businessMultiplier = 2.0;
  else if (propOpts.businessType === 'factory') businessMultiplier = 2.8;

  // 4. 건물 구조 등급별 보정 계수
  let gradeMultiplier = 1.0;
  if (propOpts.buildingGrade === 'grade_1') gradeMultiplier = 0.8;
  else if (propOpts.buildingGrade === 'grade_3') gradeMultiplier = 1.5;

  // 5. 특약 추가 보험료 설정
  let riderCost = 0;
  if (propOpts.hasWaterLeak) riderCost += 3500;
  if (propOpts.hasPremisesLiability) riderCost += 5000;
  if (propOpts.hasBusinessInterruption) riderCost += 8000;
  
  if (propOpts.hasFoodLiability && propOpts.businessType === 'restaurant') {
    riderCost += 4000;
  }
  if (propOpts.hasMachineryBreakdown && (propOpts.businessType === 'factory' || propOpts.businessType === 'warehouse')) {
    riderCost += 15000;
  }

  // 6. 각 상품별 보험료 산정 및 1만 원 미만 상품 조정
  const calculatePropertyConfig = (
    planType: 'diet' | 'balance' | 'premium'
  ) => {
    // 1. 자산 가치 비례 조정
    let configBuilding = propOpts.buildingLimit;
    let configInterior = propOpts.interiorLimit;
    let configEquipment = propOpts.equipmentLimit;
    let configInventory = propOpts.inventoryLimit;
    
    if (planType === 'diet') {
      configBuilding = configBuilding * 0.8;
      configInterior = configInterior * 0.8;
      configEquipment = configEquipment * 0.8;
      configInventory = configInventory * 0.8;
    }
    const configTotalAssets = configBuilding + configInterior + configEquipment + configInventory;
    const configAssetRatio = Math.max(0.1, configTotalAssets / 200000000);

    // 2. 특약비 조정
    let configRiderCost = 0;
    if (planType === 'diet') {
      // Diet: Only premises liability (basic)
      configRiderCost += 5000;
    } else if (planType === 'balance') {
      // Balance: Selected options
      configRiderCost = riderCost;
    } else {
      // Premium: All options + business interruption + extra liability
      configRiderCost += 3500; // hasWaterLeak
      configRiderCost += 5000; // premises liability
      configRiderCost += 8000; // business interruption
      if (propOpts.businessType === 'restaurant') {
        configRiderCost += 4000; // food liability
      }
      if (propOpts.businessType === 'factory' || propOpts.businessType === 'warehouse') {
        configRiderCost += 15000; // machinery breakdown
      }
    }

    const configResults = activeProducts.map(p => {
      const basePremium = isMale ? p.premiumMale : p.premiumFemale;
      const calculatedBase = basePremium * configAssetRatio * businessMultiplier * gradeMultiplier;
      const rawPremium = calculatedBase + configRiderCost;
      const finalPremium = Math.round(rawPremium / 100) * 100;
      const paidPremium = Math.max(10000, finalPremium);

      const formatLimitText = (num: number) => {
        if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억 원`;
        return `${(num / 10000).toLocaleString()}만 원`;
      };

      const detailDetails: Record<string, string> = {
        '건물 화재 실손': formatLimitText(configBuilding),
        '시설 및 인테리어': formatLimitText(configInterior),
        '집기비품 보장': formatLimitText(configEquipment),
        '재고자산 손실': formatLimitText(configInventory),
        '대인/대물 배상책임': (planType === 'diet' ? true : propOpts.hasPremisesLiability) ? '최대 10억 원 한도' : '미가입',
        '급배수 누출손해': (planType === 'diet' ? false : (planType === 'premium' ? true : propOpts.hasWaterLeak)) ? '500만 원 한도 (아래층 포함)' : '미보장',
        '점포 휴업손해': (planType === 'diet' ? false : (planType === 'premium' ? true : propOpts.hasBusinessInterruption)) ? '1일당 10만 원 지급 (최대 90일)' : '미보장',
      };

      if (propOpts.businessType === 'restaurant') {
        detailDetails['음식물 배상책임'] = (planType === 'diet' ? false : (planType === 'premium' ? true : propOpts.hasFoodLiability)) ? '1인당 1천만 / 1사고 1억 원' : '미가입';
      }
      if (propOpts.businessType === 'factory' || propOpts.businessType === 'warehouse') {
        detailDetails['기계고장/전기손해'] = (planType === 'diet' ? false : (planType === 'premium' ? true : propOpts.hasMachineryBreakdown)) ? '최대 5천만 원 실손보상' : '미보장';
      }

      return {
        premium: paidPremium,
        riskPremium: finalPremium,
        savingsPremium: Math.max(0, paidPremium - finalPremium),
        productName: p.productName,
        companyName: p.company,
        planLevel: planType === 'diet' ? '실속형' : planType === 'balance' ? '사업장 올케어 플랜' : '프리미엄형',
        details: detailDetails
      };
    });

    configResults.sort((a, b) => {
      if (a.premium !== b.premium) {
        return a.premium - b.premium;
      }
      return a.riskPremium - b.riskPremium;
    });
    return configResults;
  };

  const dietPlans = calculatePropertyConfig('diet');
  const balancePlans = calculatePropertyConfig('balance');
  const premiumPlans = calculatePropertyConfig('premium');

  return {
    premium: balancePlans[0].premium,
    riskPremium: balancePlans[0].riskPremium,
    savingsPremium: balancePlans[0].savingsPremium,
    productName: balancePlans[0].productName,
    companyName: balancePlans[0].companyName,
    _allOptions: balancePlans,
    _dietPlan: dietPlans[0],
    _upgradePlan: balancePlans[0],
    _hybridPlan: premiumPlans[0],
    _upgradePlans: balancePlans,
    _hybridPlans: premiumPlans
  };
};
