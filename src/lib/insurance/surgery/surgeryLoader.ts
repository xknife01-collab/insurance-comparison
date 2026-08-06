import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 수술/입원 보험 전용 데이터 로더
 * 장기보장성 비교공시 XLS → ingest_surgery.py 로 적재된 데이터 활용
 * 기준: 수술비 1,000만원 담보 보험료 합산 (40세 기준)
 */
export async function fetchSurgeryPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const isMale = (analysis.gender === 'M' || analysis.gender?.toString() === '남');
    const dbGender = isMale ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const getAgeRatio = (a: number): number => {
      if (a <= 25) return 0.5;
      if (a <= 35) return 0.75;
      if (a <= 45) return 1.00;
      if (a <= 55) return 1.40;
      if (a <= 65) return 2.00;
      return 3.00;
    };
    const ageRatio = getAgeRatio(targetAge) / getAgeRatio(40);

    // 성별·연령 기준으로 조회
    const { data, error } = await supabase
      .from('insurance_surgery_hospital_rates')
      .select('company_name, product_name, rider_name, category_type, premium')
      .eq('gender', dbGender)
      .eq('age', 40);

    if (error || !data || data.length === 0) return null;

    // 상품별로 담보 보험료 합산
    const productMap: Record<string, { company: string; product: string; total: number; riders: string[] }> = {};
    for (const row of data) {
      const key = `${row.company_name}__${row.product_name}`;
      if (!productMap[key]) {
        productMap[key] = { company: row.company_name, product: row.product_name, total: 0, riders: [] };
      }
      productMap[key].total += (row.premium || 0);
      productMap[key].riders.push(row.rider_name);
    }

    const results = Object.values(productMap)
      .map(p => ({
        premium: Math.round(p.total * ageRatio),
        productName: p.product,
        companyName: p.company,
        riderCount: p.riders.length,
      }))
      .filter(r => r.premium >= 10000)
      .sort((a, b) => a.premium - b.premium);

    if (results.length === 0) return null;

    // ── 사용자 입력 옵션 연결 ──────────────────────────────────────────────
    // SurgeryFields → InsuranceCalculator → analysis.surgery_hospital 로 전달된 값을 읽어
    // DB 기본 보험료에 옵션별 보정값을 더해 최종 보험료를 산출합니다.
    const surgOpts = (analysis as any).surgery_hospital || {};

    // ① 수술비 보장 스타일 배율
    // InsuranceCalculator.tsx 는 'focus' 키로 전달하므로 양쪽 모두 지원
    const surgFocus = surgOpts.focus || surgOpts.surgeryFocus || 'wide';
    const focusMult =
      surgFocus === 'named'  ? 1.20 :  // 1-5종 정밀 요율형: 고액 수술 보장 추가
      surgFocus === 'major'  ? 0.88 :  // 중증 집중형: 범위 좁아 할인
      1.0;                             // 광범위형: 기본값

    // ② 입원일당 목표액 → 월 보험료 환산 (1만원 당 월 약 1,000원 수준 가산 = hospitalAmount * 0.1 * 나이 배율)
    const hospitalAdd = Math.round((surgOpts.hospitalAmount || 0) * 0.1 * ageRatio);

    // ③ 간병인 서비스 옵션
    const caregiverAdd =
      surgOpts.caregiverOption === 'support' ? Math.round(28000 * ageRatio) :
      surgOpts.caregiverOption === 'use'     ? Math.round(15000 * ageRatio) :
      0;

    // ④ 상급종합병원 집중 보장
    const tertiaryAdd = surgOpts.tertiaryHospital ? Math.round(7000 * ageRatio) : 0;

    // 최종 조정 보험료 산출 (기본 DB 보험료 × 수술 스타일 배율 + 입원일당 + 간병인 + 상급병원)
    const basePremium = results[0].premium;
    const adjustedPremium = Math.max(10000, Math.round(basePremium * focusMult + hospitalAdd + caregiverAdd + tertiaryAdd));

    // _allOptions 도 동일 배율로 조정
    const adjustedOptions = results.map(r => ({
      ...r,
      premium: Math.max(10000, Math.round(r.premium * focusMult + hospitalAdd + caregiverAdd + tertiaryAdd)),
    }));

    return {
      premium: adjustedPremium,
      productName: results[0].productName,
      companyName: results[0].companyName,
      _allOptions: adjustedOptions,
    };
  } catch (e) {
    console.error('[Surgery Loader Error]:', e);
    return null;
  }
}
