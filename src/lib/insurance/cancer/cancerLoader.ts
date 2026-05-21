import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 암 보험 전용 데이터 로더
 * 연령/성별 보정 계수를 적용하고, 갱신형/비갱신형/표적항암형 등 
 * 사용자의 선택 타입에 맞는 최적의 상품을 Supabase에서 추출합니다.
 */
export async function fetchCancerPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const category = (analysis.selectedCategory || '').trim().toLowerCase();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    
    const { data: cancerRates, error: cError } = await supabase
      .from('insurance_cancer_rates')
      .select('*');

    const { data: cancerProds, error: cpError } = await supabase
      .from('insurance_cancer_products')
      .select('*');

    if (cancerRates && cancerRates.length > 0 && cancerProds) {
      const prodMap = new Map();
      const infoMap = new Map(cancerProds.map(p => [p.product_name, p]));

      cancerRates.forEach(r => {
        if (r.gender !== dbGender) return;

        const product = infoMap.get(r.product_name);
        if (!product) return;

        const targetAge = analysis.age || 40;
        const isMale = dbGender === 'M';

        // 연령/성별 정밀 보정 계수
        const getAgeIndex = (age: number, male: boolean): number => {
          if (male) {
            if (age <= 25) return 0.42; if (age <= 35) return 0.65; if (age <= 45) return 1.00;
            if (age <= 55) return 1.62; if (age <= 65) return 2.45; if (age <= 75) return 4.20;
            return 6.50;
          } else {
            if (age <= 25) return 0.48; if (age <= 35) return 0.72; if (age <= 45) return 1.00;
            if (age <= 55) return 1.35; if (age <= 65) return 1.70; if (age <= 75) return 2.80;
            return 4.10;
          }
        };

        const ageRatio = getAgeIndex(targetAge, isMale) / getAgeIndex(40, isMale);
        const coverageAmount = (analysis as any).cancer?.currentAmount || 30000000;
        let coverageMultiplier = coverageAmount / 30000000;
        
        if (r.premium > 50000) {
          coverageMultiplier = 1.0 + (coverageMultiplier - 1.0) * 0.4;
        }
        
        const correctedPremium = Math.round(r.premium * ageRatio * coverageMultiplier);

        // 유형 필터링 (갱신/비갱신/표적항암)
        const selectedPaymentType = (analysis as any).cancer?.paymentType || 'non-renewable';
        const dbCategory = product.category || '';

        if (selectedPaymentType === 'renewable') {
          if (dbCategory.includes('비갱신') || !dbCategory.includes('갱신')) return;
        } else if (selectedPaymentType === 'targeted') {
          if (!dbCategory.includes('표적') && !dbCategory.includes('항암') && !dbCategory.includes('치료비')) return;
          if (dbCategory.includes('갱신') || r.product_name.includes('갱신')) return;
        } else {
          if (dbCategory.includes('갱신') && !dbCategory.includes('비갱신')) return;
          if (dbCategory.includes('표적') || dbCategory.includes('항암') || dbCategory.includes('치료비')) return;
        }

        const wantRecurrent = (analysis as any).cancer?.recurrentCancer;
        const isRecurrentProd = r.product_name.includes('재진단') || r.product_name.includes('또받는') || r.product_name.includes('다시받는') || r.product_name.includes('전이');
        
        let finalPackagePremium = correctedPremium;
        if (wantRecurrent && !isRecurrentProd) {
          finalPackagePremium = Math.round(finalPackagePremium * 1.3);
        }

        const wantTreatment2025 = (analysis as any).cancer?.treatmentCost2025;
        const wantTargeted = (analysis as any).cancer?.targetedTherapy;

        if (wantTreatment2025) finalPackagePremium += Math.round(18000 * ageRatio); 
        if (wantTargeted) finalPackagePremium += Math.round(10000 * ageRatio);

        const groupKey = r.product_name;
        if (!prodMap.has(groupKey)) {
          prodMap.set(groupKey, {
            premium: finalPackagePremium,
            productName: product.product_name.replace(/\(.*?\)|\[.*?\]/g, '').trim(),
            companyName: product.company_name,
            category: product.category || '진단비형',
            riderCount: 1
          });
        }
      });

      const results = Array.from(prodMap.values()).sort((a, b) => a.premium - b.premium);
      if (results.length > 0) {
        return {
          premium: results[0].premium,
          productName: results[0].productName,
          companyName: results[0].companyName,
          category: results[0].category,
          _allOptions: results
        };
      }
    }
    return null;
  } catch (e) {
    console.error('[Cancer Loader Critical Error]:', e);
    return null;
  }
}
