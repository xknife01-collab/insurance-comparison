import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface CarRate {
  companyName: string;
  productName: string;
  basePremium: number;
}

// Failsafe Mock 요율표
const MOCK_CAR_RATES = [
  { companyName: '삼성화재', productName: '다이렉트 애니카' },
  { companyName: '현대해상', productName: '다이렉트 하이카' },
  { companyName: 'DB손해보험', productName: '다이렉트 프로미' },
  { companyName: 'KB손해보험', productName: '다이렉트 매직카' },
  { companyName: '메리츠화재', productName: '다이렉트 메리츠' },
  { companyName: '한화손해보험', productName: '다이렉트 한화' }
];

export const fetchCarPremium = async (
  analysis: InsuranceAnalysis
): Promise<{ premium: number; productName: string; companyName: string; _allOptions: any[] } | null> => {
  const age = analysis.age || 35;
  const genderVal = (analysis.gender || 'M').toString().toUpperCase();
  const gender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';

  // 연령대 그룹 매핑
  let ageGroup = '31_49';
  if (age < 26) ageGroup = 'under_26';
  else if (age <= 30) ageGroup = '26_30';
  else if (age >= 50) ageGroup = '50_above';

  let results: CarRate[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('insurance_car_rates')
      .select('company_name, product_name, base_premium')
      .eq('age_group', ageGroup)
      .eq('gender', gender);

    if (error) throw error;

    if (data && data.length > 0) {
      results = data.map((item) => ({
        companyName: item.company_name,
        productName: item.product_name,
        basePremium: item.base_premium
      }));
    }
  } catch (err) {
    console.warn('Supabase DB 조회 오류 또는 데이터 없음, Mock 데이터로 동작합니다:', err);
  }

  if (results.length === 0) {
    // Failsafe Mock 요율 연산
    let baseline = 800000;
    if (ageGroup === 'under_26') baseline = gender === 'M' ? 1250000 : 1080000;
    else if (ageGroup === '26_30') baseline = gender === 'M' ? 980000 : 890000;
    else if (ageGroup === '31_49') baseline = gender === 'M' ? 760000 : 720000;
    else if (ageGroup === '50_above') baseline = gender === 'M' ? 820000 : 790000;

    // 회사별로 약 2~5% 편차 적용
    const deviations = [1.02, 0.98, 1.0, 1.01, 0.97, 1.03];
    results = MOCK_CAR_RATES.map((item, idx) => ({
      companyName: item.companyName,
      productName: item.productName,
      basePremium: Math.round(baseline * deviations[idx])
    }));
  }

  const mainOption = results[0] || { companyName: '삼성화재', productName: '다이렉트 애니카', basePremium: 800000 };

  return {
    premium: mainOption.basePremium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
