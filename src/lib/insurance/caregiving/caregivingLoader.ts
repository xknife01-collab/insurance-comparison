import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 간병 보험 전용 데이터 로더
 * 체증형(Step-up) 옵션, 요양병원 강화, 간호간병 통합서비스 등 
 * 복잡한 특약 가산 로직을 처리하여 최적의 간병 플랜을 반환합니다.
 */
export async function fetchCaregivingPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;
    const careTypePreference = (analysis as any).caregiving?.type === 'support' ? '지원일당' : '사용일당';

    const { data: careData, error: careError } = await supabase
      .from('caregiving_insurance_plans')
      .select('*');

    if (careError || !careData || careData.length === 0) return null;

    const seen = new Set<string>();
    const groupMin = new Map<string, { premium: number; meta: any }>();

    careData.forEach(p => {
      const rawName = p.product_name || '';
      const isCareTarget = rawName.includes('간병') || rawName.includes('요양') || rawName.includes('치매');
      const isExcluded = /건강보험|종합보험|암보험|운전자|뇌혈관|심장|수술|입원|정기보험/.test(rawName);
      if (!isCareTarget || isExcluded) return;

      const rawPremium = dbGender === 'M' ? p.premium_male_40 : p.premium_female_40;
      if (!rawPremium || rawPremium === 0) return;

      const dupeKey = `${rawName}|${rawPremium}`;
      if (seen.has(dupeKey)) return;
      seen.add(dupeKey);

      // 연령 보정
      const ratio = (function(a: number) {
        if (a <= 35) return 0.85; if (a <= 45) return 1.0;
        if (a <= 55) return 1.25; if (a <= 65) return 1.55; return 2.2;
      })(targetAge);
      const corrected = Math.round(rawPremium * ratio);

      const userWantsStepUp = !!(analysis as any).caregiving?.isStepUp;
      const userWantsNursing = !!(analysis as any).caregiving?.isNursingHospital;
      const dbIsStepUp = !!p.is_increasing;
      
      let basePremium = Math.round(corrected * 1.25);
      
      if (userWantsStepUp && !dbIsStepUp) basePremium = Math.round(basePremium * 1.25);
      else if (!userWantsStepUp && dbIsStepUp) basePremium = Math.round(basePremium * 0.8);

      if (userWantsNursing) basePremium = Math.round(basePremium * 1.2);

      const userWantsGeriatric = !!(analysis as any).caregiving?.focusGeriatric;
      if (userWantsGeriatric) basePremium = Math.round(basePremium * 1.15);

      const userWantsIntegrated = !!(analysis as any).caregiving?.focusIntegrated;
      if (userWantsIntegrated) basePremium = Math.round(basePremium * 1.08);

      const normalizedName = rawName.replace(/\(.*?\)|\[.*?\]|\d+종|\d+/g, '').trim();
      const groupKey = `${p.company_name}__${p.care_type}__${normalizedName}`;
      const typeMatch = !!(p.care_type === careTypePreference || (p.care_type && p.care_type.includes(careTypePreference)));

      const existing = groupMin.get(groupKey);
      if (!existing || basePremium < existing.premium) {
        groupMin.set(groupKey, {
          premium: basePremium,
          meta: {
            productName: p.product_name + (userWantsStepUp && !dbIsStepUp ? ' (체증형)' : ''),
            companyName: p.company_name,
            typeMatch
          }
        });
      }
    });

    const results = Array.from(groupMin.values())
      .map(v => ({ premium: v.premium, ...v.meta }))
      .filter(r => r.typeMatch)
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
    console.error('[Caregiving Loader Critical Error]:', e);
    return null;
  }
}
