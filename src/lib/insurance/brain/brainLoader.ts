import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 뇌혈관 보험 전용 데이터 로더
 */
export async function fetchBrainPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    // 1. 요율 데이터 가져오기
    const { data: brainRates, error: bError } = await supabase
      .from('brain_insurance_rates')
      .select('*')
      .eq('gender', dbGender);

    if (bError) {
      console.error('[Brain Loader] SQL Error:', bError);
      return null;
    }

    // 2. 상품 정보 가져오기 (카테고리 매핑용)
    const { data: products } = await supabase
      .from('brain_insurance_products')
      .select('product_name, company_name, category');
      
    const productInfoMap = new Map();
    if (products) {
      products.forEach(p => {
        productInfoMap.set(p.product_name, { company: p.company_name, category: p.category });
      });
    }

    if (brainRates && brainRates.length > 0) {
      // 3. 보험료 계산
      let results = brainRates.map(r => {
        const raw = r.raw_data || {};
        const baseDiag = raw.diag_premium || r.premium;
        // 엑셀 데이터에 수술비가 따로 명시되어 있지 않은 경우 진단비의 약 25%를 수술비 요율로 시뮬레이션 적용
        const baseSurg = raw.surg_premium || Math.round(baseDiag * 0.25);
        const info = productInfoMap.get(r.product_name);
        
        // 연령 보정
        const getAgeIndex = (a: number): number => {
          if (a <= 20) return 0.38;
          if (a <= 30) return 0.58;
          if (a <= 40) return 1.00;
          if (a <= 50) return 1.75;
          if (a <= 60) return 3.20;
          if (a <= 70) return 5.50;
          return 7.00;
        };
        const ageRatio = getAgeIndex(targetAge) / getAgeIndex(40);
        
        // 가입 금액 배수 (1, 2, 3천만)
        const coverageAmount = analysis.cerebrovascular?.currentAmount || 10000000;
        let coverageMultiplier = 1.0;
        if (coverageAmount === 20000000) coverageMultiplier = 1.85;
        else if (coverageAmount === 30000000) coverageMultiplier = 2.70;
        // 보장 만기(80, 90, 100세) 보정 
        // 사용자님 피드백 반영: 엑셀 원본 요율(약 18,000원대)이 매우 저렴하므로 기본값을 80세 만기로 간주함!
        const coveragePeriod = (analysis.cerebrovascular as any)?.coveragePeriod || 80;
        let maturityMultiplier = 1.0; // 80세 기준
        if (coveragePeriod === 90) maturityMultiplier = 1.25; // 90세는 약 25% 비쌈
        else if (coveragePeriod === 100) maturityMultiplier = 1.55; // 100세는 약 55% 비쌈

        const finalDiag = Math.round(baseDiag * ageRatio * coverageMultiplier * maturityMultiplier);
        const finalSurg = Math.round(baseSurg * ageRatio * maturityMultiplier);
        
        // 수술비 포함 여부에 따른 최종가
        const hasSurgery = (analysis.cerebrovascular as any)?.surgeryBenefit;
        const totalPremium = hasSurgery ? (finalDiag + finalSurg) : finalDiag;

        // 상품명에 '갱신' 포함 여부로 갱신형/비갱신형 속성 부여
        const isProductRenewable = r.product_name.includes('갱신');

        return {
          premium: totalPremium,
          productName: r.product_name,
          companyName: info?.company || '국내보험사',
          category: info?.category || '뇌혈관질환',
          isRenewable: isProductRenewable
        };
      });

      // 4. 상세 타입 및 갱신 유형 필터링
      const selectedType = analysis.cerebrovascular?.selectedType;
      const isSelectedRenewable = (analysis.cerebrovascular as any)?.paymentType === 'renewable';
      
      results = results.filter(r => r.isRenewable === isSelectedRenewable);
      
      if (selectedType && selectedType !== '전체') {
        results = results.filter(r => r.category === selectedType);
      }

      results.sort((a, b) => a.premium - b.premium);

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
    console.error('[Brain Loader Critical Error]:', e);
    return null;
  }
}
