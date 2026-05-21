import { createClient } from '../../utils/supabase/client';
import { InsuranceAnalysis } from '../../types/insurance';

/**
 * 범용 데이터 로더 (Fallback)
 * 특정 모듈이 정의되지 않은 일반 건강보험이나 
 * 기타 카테고리의 기본 보험료 조회를 담당합니다.
 */
export async function fetchPremiumFromDatabase(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    // 기본 건강보험 요율 테이블 조회
    const { data: defaultRates, error } = await supabase
      .from('insurance_cancer_rates') // 범용 데이터 소스
      .select('*')
      .eq('gender', dbGender)
      .limit(10);

    if (error || !defaultRates || defaultRates.length === 0) return null;

    const results = defaultRates.map(r => {
      const ratio = targetAge / 40; // 단순 비례식 (Fallback용)
      return {
        premium: Math.round(r.premium * ratio),
        productName: r.product_name,
        companyName: '국내주요보험사'
      };
    }).sort((a, b) => a.premium - b.premium);

    return results[0] ? { ...results[0], _allOptions: results } : null;
  } catch (e) {
    console.error('[Fallback Loader Error]:', e);
    return null;
  }
}

/**
 * 심장질환 전용 데이터 로더
 */
export async function loadHeartPlans() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('heart_insurance_plans')
      .select('*');

    if (error) {
      console.error('[Heart Loader Error]:', error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error('[Heart Loader Error]:', e);
    return [];
  }
}
