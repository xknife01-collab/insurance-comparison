import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 유병자(간편고지) 보험 전용 데이터 로더
 * 3.5.5, 3.10.5 등 병력 고지 기간에 따른 보험료 차이를 분석하고
 * 유병자 전용 플랜의 요율을 Supabase에서 추출합니다.
 */
export async function fetchPreExistingPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    // 연령대 버킷 (rates JSON 키에 맞게: 20, 30, 40, 50, 60)
    const ageBucket = targetAge <= 25 ? 20 : targetAge <= 35 ? 30 : targetAge <= 45 ? 40 : targetAge <= 55 ? 50 : 60;
    const rateKey = `premium_${dbGender}_${ageBucket}`;

    // 유병자 전용 테이블 조회
    const { data: preData, error } = await supabase
      .from('insurance_yu_byung_ja')
      .select('company_name, product_name, review_type, category, is_renewable, rates');

    if (error || !preData || preData.length === 0) return null;

    const results = preData.map((r: any) => {
      const getAgeIndex = (a: number): number => {
        if (a <= 25) return 0.55; if (a <= 35) return 0.80; if (a <= 45) return 1.00;
        if (a <= 55) return 1.50; if (a <= 65) return 2.10; return 3.20;
      };
      const ageRatio = getAgeIndex(targetAge) / getAgeIndex(40);

      // rates JSON에서 해당 성별·연령대 보험료 추출
      const basePremium = r.rates?.[rateKey] || 0;
      if (!basePremium || basePremium <= 0) return null;

      // 유병자 기본 할증 적용 (표준체 대비 약 1.3배)
      const finalPremium = Math.round(basePremium * ageRatio * 1.3);

      return {
        premium: finalPremium,
        productName: r.product_name,
        companyName: r.company_name,
        reviewType: r.review_type,
      };
    }).filter(Boolean).sort((a: any, b: any) => a.premium - b.premium);

    if (results.length > 0) {
      return {
        premium: results[0].premium,
        productName: results[0].productName,
        companyName: results[0].companyName,
        _allOptions: results
      };
    }
    return null;
  } catch (e) {
    console.error('[PreExisting Loader Critical Error]:', e);
    return null;
  }
}
