import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 치아 보험 전용 데이터 로더
 * 임플란트, 크라운 보장 한도 및 진단형/무진단형 옵션, 
 * 유병자 여부에 따른 정밀 보험료 산출 로직을 담당합니다.
 */
export async function fetchDentalPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal === 'M' || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const { data: dentalRates, error: dError } = await supabase
      .from('dental_rates')
      .select(`
        rate_data,
        age,
        gender,
        product_code,
        dental_products (
          display_name,
          company_name
        )
      `)
      .eq('gender', dbGender);

    if (dError || !dentalRates || dentalRates.length === 0) return null;

    const results = dentalRates.map((r: any) => {
      const rawPremium = r.rate_data?.premium || r.rate_data?.m || r.rate_data?.f || 0;
      if (rawPremium === 0) return null;

      const sourceAge = r.age || 40;
      const getAgeIndex = (a: number): number => {
        if (a <= 25) return 0.65; if (a <= 35) return 0.85; if (a <= 45) return 1.00;
        if (a <= 55) return 1.45; if (a <= 65) return 1.75; return 2.20;
      };
      const ageRatio = getAgeIndex(targetAge) / getAgeIndex(sourceAge);
      const genderRatio = dbGender === 'F' ? 1.08 : 1.0;

      const diagType = (analysis as any).dental?.diagnosticType || 'non-diagnostic';
      const diagnosticRatio = diagType === 'diagnostic' ? 0.80 : 1.00;
      
      const dental = (analysis as any).dental;
      const isHighRisk = dental?.lastYear === 'yes' || dental?.last5Years === 'yes' || dental?.dentures === 'yes';
      const simplifiedRatio = isHighRisk ? 1.35 : 1.00;
      const implantRatio = dental?.implantLimit === '3' ? 0.88 : 1.00;
      const crownRatio = dental?.crownAmount === 500000 ? 1.40 : (dental?.crownAmount === 300000 ? 1.15 : 1.00);

      const correctedPremium = Math.round(rawPremium * ageRatio * genderRatio * diagnosticRatio * simplifiedRatio * implantRatio * crownRatio);
      const product = Array.isArray(r.dental_products) ? r.dental_products[0] : r.dental_products;

      return {
        premium: correctedPremium,
        productName: product?.display_name || '치아보험 상품',
        companyName: product?.company_name || '보험사'
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.premium - b.premium);

    if (results.length > 0) {
      const seen = new Set();
      const uniqueResults = results.filter((r: any) => {
        const key = `${r.companyName}_${r.productName}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return {
        premium: uniqueResults[0].premium,
        productName: uniqueResults[0].productName,
        companyName: uniqueResults[0].companyName,
        _allOptions: uniqueResults
      };
    }
    return null;
  } catch (e) {
    console.error('[Dental Loader Critical Error]:', e);
    return null;
  }
}
