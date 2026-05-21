import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 수술/입원 보험 전용 데이터 로더
 * 질병/상해 수술비, 입원 일당 등 수술 및 입원 보장에 특화된 
 * 보험 상품 데이터를 Supabase에서 추출하고 연령 보정을 수행합니다.
 */
export async function fetchSurgeryPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const isMale = (analysis.gender === 'M' || analysis.gender.toString() === '남');
    const genderSuffix = isMale ? 'm' : 'f';
    const premiumCol = isMale ? 'premium_male' : 'premium_female';
    const mainCol = isMale ? 'premium_main_m' : 'premium_main_f';
    const targetAge = analysis.age || 40;

    // UI에서 선택한 보장 스타일 및 옵션 추출
    const config = (analysis as any).surgery_hospital || { focus: 'wide', caregiverOption: 'none' };
    const focus = config.focus || 'wide';
    const caregiver = config.caregiverOption || 'none';

    // 수술/입원 전용 테이블 조회 (모든 상세 필드 포함)
    const { data: surgeryData, error } = await supabase
      .from('insurance_surgery_hospital_rates')
      .select(`company_name, product_name, ${mainCol}, cat_1_5_${genderSuffix}, cat_n_disease_${genderSuffix}, cat_injury_${genderSuffix}, cat_hospital_${genderSuffix}, cat_caregiver_${genderSuffix}`)
      .eq('age', 40);

    if (error || !surgeryData || surgeryData.length === 0) return null;

    const getAgeIndex = (a: number): number => {
      if (a <= 25) return 0.5; if (a <= 35) return 0.75; if (a <= 45) return 1.00;
      if (a <= 55) return 1.40; if (a <= 65) return 2.00; return 3.00;
    };

    const ageRatio = getAgeIndex(targetAge) / getAgeIndex(40);

    const results = surgeryData.map((r: any) => {
      const main = (r[mainCol] || 0);
      const cat15 = (r[`cat_1_5_${genderSuffix}`] || 0);
      const catN = (r[`cat_n_disease_${genderSuffix}`] || 0);
      const catInjury = (r[`cat_injury_${genderSuffix}`] || 0);
      const catHospital = (r[`cat_hospital_${genderSuffix}`] || 0);
      const catCare = (r[`cat_caregiver_${genderSuffix}`] || 0);

      // ── 스타일별 합산 로직 실행 ──
      let total = main; // 주계약은 기본 포함

      if (focus === 'wide') {
        total += (cat15 + catN + catInjury); // 모든 수술 폭넓게
      } else if (focus === 'named') {
        total += cat15; // 1-5종 정밀 요율
      } else if (focus === 'major') {
        total += catN; // 중증(N대) 집중
      }

      // 입원비/간병인 옵션 추가
      if (catHospital > 0) total += catHospital; 
      if (caregiver !== 'none' && catCare > 0) total += catCare;

      const finalPremium = Math.round(total * ageRatio);

      return {
        premium: finalPremium,
        productName: r.product_name,
        companyName: r.company_name,
        details: {
          main: Math.round(main * ageRatio),
          cat_1_5: Math.round(cat15 * ageRatio),
          cat_n_disease: Math.round(catN * ageRatio),
          cat_injury: Math.round(catInjury * ageRatio),
          cat_hospital: Math.round(catHospital * ageRatio),
          cat_caregiver: Math.round(catCare * ageRatio),
        }
      };
    })
    .filter(res => res.premium >= 20000) // 최종 합산액이 2만원 이상인 것만
    .sort((a, b) => a.premium - b.premium);

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
    console.error('[Surgery Loader Critical Error]:', e);
    return null;
  }
}
