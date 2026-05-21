import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 의료실비(실손) 전용 데이터 로더
 * 4세대 실손 보험료를 조회하고, 사용자의 비급여 이용량에 따른 
 * 보험료 차등제(할인/할증) 시뮬레이션 결과를 반환합니다.
 */
export async function fetchSilsonPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const subType = analysis.silson?.subType || '4세대 실손';
    const dbCategory = subType === '노후 실손' ? '노후_의료실비' : '실속_의료실비';

    const { data: silsonRates } = await supabase
      .from('medical_silson_rates')
      .select('*')
      .eq('gender', dbGender);

    const { data: silsonProds } = await supabase
      .from('medical_silson_products')
      .select('*')
      .eq('category', dbCategory);

    if (silsonRates && silsonRates.length > 0 && silsonProds) {
      const prodMap = new Map(silsonProds.map(p => [p.product_code, p]));
      const results = silsonRates.map(r => {
        const product = prodMap.get(r.product_code);
        if (!product) return null;

        const basePremium = r.rate_data.premium;
        const sourceAge = r.age || 40;
        
        const getAgeIndex = (a: number): number => {
          if (a <= 25) return 0.65; if (a <= 35) return 0.80; if (a <= 45) return 1.00;
          if (a <= 55) return 1.50; if (a <= 65) return 3.00; return 4.50;
        };
        const ageRatio = getAgeIndex(targetAge) / getAgeIndex(sourceAge);
        const ageCorrectedPremium = Math.round(basePremium * ageRatio);

        // 비급여 차등제 적용
        const usageType = analysis.silson?.nonReimbursableUsage || 'under100';
        const getUsageMultiplier = (type: string): number => {
          switch (type) {
            case 'none': return 0.95; case 'under100': return 1.0;
            case '100to150': return 2.0; case '150to300': return 3.0;
            case 'over300': return 4.0; default: return 1.0;
          }
        };

        const benefitPart = ageCorrectedPremium * 0.6;
        const nonBenefitPart = ageCorrectedPremium * 0.4 * getUsageMultiplier(usageType);
        const finalPremium = Math.round(benefitPart + nonBenefitPart);

        return {
          premium: finalPremium,
          productName: product.display_name,
          companyName: product.company_name
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
    }
    return null;
  } catch (e) {
    console.error('[Silson Loader Critical Error]:', e);
    return null;
  }
}
