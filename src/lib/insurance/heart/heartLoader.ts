import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 심장질환 보험 전용 데이터 로더
 */
export async function fetchHeartPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    
    // 심장질환 전용 테이블 조회
    const { data: heartPlans, error } = await supabase
      .from('heart_insurance_plans')
      .select('*');

    if (error || !heartPlans || heartPlans.length === 0) {
      console.error('[Heart Loader Error]:', error);
      return null;
    }

    const targetAge = analysis.age || 40;
    const isMale = dbGender === 'M';

    // 심장질환 연령 보정 계수 (일반적인 통계 기반)
    const getAgeIndex = (age: number, male: boolean): number => {
      if (male) {
        if (age <= 25) return 0.35; if (age <= 35) return 0.70; if (age <= 45) return 1.10;
        if (age <= 55) return 1.90; if (age <= 65) return 3.20; if (age <= 75) return 5.50;
        return 8.00;
      } else {
        if (age <= 25) return 0.30; if (age <= 35) return 0.60; if (age <= 45) return 1.00;
        if (age <= 55) return 1.50; if (age <= 65) return 2.40; if (age <= 75) return 4.20;
        return 6.00;
      }
    };

    const ageRatio = getAgeIndex(targetAge, isMale) / getAgeIndex(40, isMale);
    const selectedType = (analysis as any).cardiovascular?.selectedType || '통합(급성+허혈성)';
    const isIntegrated = selectedType.includes('통합');

    const heartOptions = heartPlans.map(plan => {
      // 남녀 보험료 선택
      let basePremium = isMale ? plan.male_premium : plan.female_premium;
      
      // 유병자 선택 시 할증 (약 1.4배)
      const isSimple = (analysis as any).heartHealthType === 'simple';
      if (isSimple) {
        basePremium = Math.round(basePremium * 1.4);
      }

      // 보장 금액 배수 계산 (사용자가 화면에서 설정한 목표 금액)
      const targetAmount = (analysis as any).cardiovascular?.targetAmount || 30000000;
      const coverageMultiplier = targetAmount / 10000000;

      // 실제 계리 방식 적용: 주계약(기본 의무가입) 고정비 약 2,500원을 제외한 '순수 진단비'에만 배수 적용
      const baseContractFee = 2500;
      let finalPremium;
      
      if (basePremium <= baseContractFee) {
        // 보험료가 너무 낮으면 예외 처리
        finalPremium = Math.round(basePremium * ageRatio * coverageMultiplier);
      } else {
        const pureRiderPremium = basePremium - baseContractFee;
        finalPremium = Math.round((pureRiderPremium * coverageMultiplier + baseContractFee) * ageRatio);
      }

      return {
        premium: finalPremium,
        productName: plan.product_name,
        companyName: plan.company,
        category: plan.category,
        coverageName: plan.coverage_name || ''
      };
    })
    .filter(p => {
      // 1. 보장 타입(급성 vs 통합) 필터링
      if (isIntegrated) {
        // 통합: '허혈성'이나 '통합'이라는 단어가 엑셀 담보/상품명에 반드시 있어야 함
        const hasIntegrated = p.coverageName.includes('허혈성') || p.productName.includes('허혈성') || p.coverageName.includes('통합') || p.productName.includes('통합');
        if (!hasIntegrated) return false;
      } else {
        // 급성: '급성'은 있고, '허혈성'이나 '통합'은 절대 없어야 함
        const hasAcute = p.coverageName.includes('급성') || p.productName.includes('급성');
        const hasIntegrated = p.coverageName.includes('허혈성') || p.productName.includes('허혈성') || p.coverageName.includes('통합');
        if (!hasAcute || hasIntegrated) return false;
      }
      return true; // 일단 모든 상품을 가져온 뒤 엔진에서 분류
    })
    .filter(p => p.premium > 5000)
    .sort((a, b) => a.premium - b.premium);

    if (heartOptions.length > 0) {
      const coverageLevel = (analysis as any).heartCoverageLevel || 'standard';
      
      // 최저가 상품(실속형)은 무조건 전체 중 1위
      const cheapestOption = heartOptions[0];
      
      // 사용자 플랜에 맞는 최적 상품 찾기
      let recommendedOption = cheapestOption;
      if (coverageLevel === 'premium') {
        recommendedOption = heartOptions.find(p => p.coverageName.includes('수술') && (p.coverageName.includes('심혈관') || p.coverageName.includes('부정맥'))) || cheapestOption;
      } else if (coverageLevel === 'standard') {
        recommendedOption = heartOptions.find(p => p.coverageName.includes('수술')) || cheapestOption;
      }

      return {
        premium: recommendedOption.premium,
        productName: recommendedOption.productName,
        companyName: recommendedOption.companyName,
        category: recommendedOption.category,
        _allOptions: heartOptions, // 전체 리스트 전달하여 엔진에서 골라 쓰게 함
        _marketLowest: cheapestOption // 최저가 정보 별도 전달
      };
    }

    return null;
  } catch (e) {
    console.error('[Heart Loader Critical Error]:', e);
    return null;
  }
}
