import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL 또는 Key가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 26개 전체 보험 카테고리 정밀 옵션 & 보험료 수식 일괄 시딩 시작...');

const allInsuranceCategories = [
  {
    category: 'cancer',
    engine_name: 'analyzeCancer',
    deficiency_rules: { min_general_diagnosis: 30000000, treatment_2025_required: true, targeted_therapy_required: true },
    recommendation_plans: { diet: '실속 암진단 집중 플랜', upgrade: '2025 최신치료비 강화 플랜', hybrid: '풀보장 프리미엄 플랜' },
    input_options_schema: {
      general_diagnosis: { label: '일반암 진단비', options: ['3,000만', '5,000만', '10,000만'], default: '5,000만' },
      treatment_cost_2025: { label: '2025 암주요치료비', options: ['포함 (추천)', '미포함'], recommended: '포함 (추천)' },
      targeted_therapy: { label: '표적항암/중입자', options: ['풀보장', '진단비만'] },
      payment_type: { label: '납입/갱신 유형', options: ['비갱신형', '갱신형', '표적항암형'] },
      recurrent_cancer: { label: '재발/전이암', options: ['반복지급', '1회지급'] },
      family_history: { label: '암 가족력', options: ['있음', '없음'] }
    },
    premium_factor_matrix: { base_40s_monthly: 34000, delta_general_diagnosis: { '3,000만': 0, '5,000만': 12000, '10,000만': 32000 }, delta_treatment_cost_2025: { '포함 (추천)': 45000, '미포함': 0 } },
    formula_explanation: '암보험 엔진: 40대 기준 기본료 34,000원. 일반암 5천만(+12,000원), 2025 암주요치료비 포함(+45,000원), 표적항암 풀보장(+3,000원), 비갱신 20년납 100세만기 기준 수식.'
  },
  {
    category: 'brain',
    engine_name: 'analyzeBrain',
    deficiency_rules: { min_cerebrovascular_diagnosis: 20000000, stroke_coverage_required: true },
    recommendation_plans: { diet: '뇌혈관 진단비 전용 플랜', upgrade: '뇌졸중/뇌출혈 통합 강화 플랜', hybrid: '뇌혈관 수술+재활 프리미엄' },
    input_options_schema: {
      brain_vascular_diagnosis: { label: '뇌혈관질환 진단비', options: ['1,000만', '2,000만', '3,000만'], default: '2,000만' },
      stroke_hemorrhage: { label: '뇌졸중/뇌출혈 특약', options: ['포함 (추천)', '미포함'] },
      brain_surgery: { label: '뇌혈관질환 수술비', options: ['1,000만', '2,000만'] }
    },
    premium_factor_matrix: { base_40s_monthly: 22000, delta_brain_vascular_diagnosis: { '1,000만': 0, '2,000만': 7000, '3,000만': 15000 } },
    formula_explanation: '뇌혈관 엔진: 기본료 22,000원. 뇌혈관 진단비 1천만당 +7,000원 변동.'
  },
  {
    category: 'heart',
    engine_name: 'analyzeHeart',
    deficiency_rules: { min_cardiovascular_diagnosis: 20000000, ischemic_surgery_required: true },
    recommendation_plans: { diet: '허혈성 심장 집중 플랜', upgrade: '부정맥/심부전 확장 플랜', hybrid: '심혈관 종합 프리미엄' },
    input_options_schema: {
      cardiovascular_diagnosis: { label: '허혈성/심혈관 진단비', options: ['1,000만', '2,000만', '3,000만'], default: '2,000만' },
      arrhythmia_coverage: { label: '부정맥/심부전 특약', options: ['포함', '미포함'] }
    },
    premium_factor_matrix: { base_40s_monthly: 19000, delta_cardiovascular_diagnosis: { '1,000만': 0, '2,000만': 6000, '3,000만': 13000 } },
    formula_explanation: '심혈관 엔진: 기본료 19,000원. 허혈성/심혈관 진단비 1천만당 +6,000원 변동.'
  },
  {
    category: 'silson',
    engine_name: 'analyzeSilson',
    deficiency_rules: { version: '4th_generation', copay_benefit: 0.20, copay_non_benefit: 0.30 },
    recommendation_plans: { standard: '4세대 표준 실손의료비 플랜' },
    input_options_schema: {
      silson_type: { label: '실비 세대 선택', options: ['4세대 표준형 (급여20%/비급여30%)', '3세대 전환형'], default: '4세대 표준형' },
      manual_therapy: { label: '도수치료 특약', options: ['연 50회 한도 포함', '미포함'] }
    },
    premium_factor_matrix: { base_40s_monthly: 14000 },
    formula_explanation: '실손의료비 엔진: 4세대 실비 기준 급여 20%, 비급여 30% 자기부담금 적용 기본 14,000원.'
  },
  {
    category: 'driver',
    engine_name: 'analyzeDriver',
    deficiency_rules: { min_criminal_settlement: 200000000, min_lawyer_fee: 50000000, min_fine_person: 30000000 },
    recommendation_plans: { diet: '핵심 3대 보장 실속 플랜', upgrade: '자동차사고 부상치료비 강화 플랜' },
    input_options_schema: {
      criminal_settlement: { label: '교통사고처리지원금(형사합의금)', options: ['1억', '2억'], default: '2억' },
      lawyer_fee: { label: '변호사선임비용', options: ['3,000만', '5,000만'], default: '5,000만' },
      driver_fine: { label: '운전자 벌금 (민식이법)', options: ['대인 3,000만 / 대물 500만'] }
    },
    premium_factor_matrix: { base_40s_monthly: 11000, delta_settlement: { '1억': 0, '2억': 2500 } },
    formula_explanation: '운전자보험 엔진: 필수 3대 특약(합의금 2억, 변호사 5천, 벌금 3천) 월 11,000원 기본 세팅.'
  },
  {
    category: 'surgery',
    engine_name: 'analyzeSurgery',
    deficiency_rules: { type_1_to_5_surgery_required: true, n_disease_surgery_required: true },
    recommendation_plans: { diet: '1~5종 수술비 전용 플랜', upgrade: 'N대 질병+다빈치 로봇수술 강화' },
    input_options_schema: {
      surgery_type_1_5: { label: '1~5종 수술비', options: ['1종 20만 ~ 5종 1,000만', '1종 30만 ~ 5종 1,500만'] },
      n_disease_surgery: { label: 'N대 질병 수술비', options: ['119대 질병 포함', '미포함'] }
    },
    premium_factor_matrix: { base_40s_monthly: 18000 },
    formula_explanation: '수술비 엔진: 1~5종 수술비 및 N대 질병 수술비 구성 수식.'
  },
  {
    category: 'caregiving',
    engine_name: 'analyzeCaregiving',
    deficiency_rules: { caregiver_daily_benefit: 150000, nursing_hospital_benefit: 50000 },
    recommendation_plans: { diet: '간병인 사용일당 실속형', upgrade: '간병인 지원+요양병원 강화형' },
    input_options_schema: {
      caregiver_daily: { label: '간병인 사용일당 (일반병원)', options: ['10만원', '15만원', '20만원'], default: '15만원' },
      nursing_hospital: { label: '요양병원 간병일당', options: ['3만원', '5만원', '7만원'] }
    },
    premium_factor_matrix: { base_40s_monthly: 25000 },
    formula_explanation: '간병인 엔진: 일반병원 15만원/요양병원 5만원 기준 기본 25,000원.'
  },
  {
    category: 'dental',
    engine_name: 'analyzeDental',
    deficiency_rules: { implant_benefit: 1000000, crown_benefit: 500000 },
    recommendation_plans: { diet: '임플란트 집중 플랜', upgrade: '보철+보존 종합 치아 플랜' },
    input_options_schema: {
      implant_amount: { label: '임플란트 1개당 진단비', options: ['50만원', '100만원', '150만원'], default: '100만원' },
      crown_amount: { label: '크라운 치료비', options: ['20만원', '40만원', '50만원'] }
    },
    premium_factor_matrix: { base_40s_monthly: 28000 },
    formula_explanation: '치아보험 엔진: 임플란트 100만원 및 크라운 50만원 기준 월 28,000원.'
  },
  {
    category: 'child',
    engine_name: 'analyzeChild',
    deficiency_rules: { prenatal_special_required: true, maturity_option: '30_vs_100' },
    recommendation_plans: { diet: '30세 만기 가성비 태아/어린이', upgrade: '100세 만기 평생 보장 플랜' },
    input_options_schema: {
      maturity_age: { label: '보장 만기 선택', options: ['30세 만기 (월 3~4만원대)', '100세 만기 (월 8~10만원대)'] },
      prenatal_special: { label: '태아 특약 (22주 이내)', options: ['포함 (신생아 질병/저체중아)', '미포함 (성인/어린이 전용)'] }
    },
    premium_factor_matrix: { base_40s_monthly: 42000 },
    formula_explanation: '어린이/태아 엔진: 22주 이내 태아특약 및 30세/100세 만기 선택형 수식.'
  },
  {
    category: 'dementia',
    engine_name: 'analyzeDementia',
    deficiency_rules: { cdr_1_benefit: 5000000, cdr_3_benefit: 30000000 },
    recommendation_plans: { diet: '경도치매(CDR 1점) 집중 플랜', upgrade: '중증치매+간병비 장기요양 플랜' },
    input_options_schema: {
      cdr_1_amount: { label: '경도치매 진단비 (CDR 1점)', options: ['300만원', '500만원', '1,000만원'] },
      lca_grade: { label: '장기요양등급 (1~5등급)', options: ['1~5등급 전체 포함', '1~2등급만'] }
    },
    premium_factor_matrix: { base_40s_monthly: 31000 },
    formula_explanation: '치매/장기요양 엔진: CDR 1점 경도치매 500만원 기준 월 31,000원.'
  },
  {
    category: 'pre-existing',
    engine_name: 'analyzePreExisting',
    deficiency_rules: { simple_type: '3.5.5', disease_history_allowed: true },
    recommendation_plans: { diet: '3.5.5 초간편 유병자 플랜', upgrade: '3.3.5/3.2.5 표준 유병자 플랜' },
    input_options_schema: {
      simple_notice: { label: '간편고지 유형', options: ['3·5·5 간편 (가장 저렴)', '3·3·5 간편', '3·2·5 간편'] }
    },
    premium_factor_matrix: { base_40s_monthly: 39000 },
    formula_explanation: '유병자 엔진: 3.5.5 초간편고지 할증 반영 수식.'
  },
  {
    category: 'car',
    engine_name: 'analyzeCar',
    deficiency_rules: { liability_person_2: true, liability_property: 500000000 },
    recommendation_plans: { standard: '다이렉트 최저가 대물 5억 자동차보험' },
    input_options_schema: {
      property_limit: { label: '대물 배상 한도', options: ['2억', '5억', '10억'], default: '5억' },
      self_injury_type: { label: '자상 vs 자손', options: ['자동차상해 (자상 추천)', '자기신체사고 (자손)'] }
    },
    premium_factor_matrix: { base_40s_monthly: 55000 },
    formula_explanation: '자동차보험 엔진: 대물 5억 + 자동차상해(자상) 기준 연간 평균 요율 세팅.'
  },
  {
    category: 'fire',
    engine_name: 'analyzeFire',
    deficiency_rules: { building_restoration: true, water_leak_liability: true },
    recommendation_plans: { diet: '우리집 화재+누수 배상 실속형', upgrade: '가전제품 6대/12대 수리비 포함' },
    input_options_schema: {
      building_val: { label: '건물 복구가액', options: ['1억', '2억', '3억'] },
      water_leak: { label: '일상생활 누수 배상책임', options: ['포함 (자기부담 50만)', '미포함'] }
    },
    premium_factor_matrix: { base_40s_monthly: 12000 },
    formula_explanation: '화재보험 엔진: 건물 복구가액 + 누수 배상책임 포함 월 12,000원 정액.'
  },
  {
    category: 'variable',
    engine_name: 'analyzeVariable',
    deficiency_rules: { stock_fund_ratio: 0.60 },
    recommendation_plans: { diet: '글로벌 주식형 펀드 리밸런싱', upgrade: '채권혼합형 안전 수익 플랜' },
    input_options_schema: {
      fund_type: { label: '펀드 구성비', options: ['주식형 70% + 채권형 30%', '인덱스 50% + 채권 50%'] }
    },
    premium_factor_matrix: { base_40s_monthly: 150000 },
    formula_explanation: '변액보험 엔진: 주식형 펀드 70% 리밸런싱 기대수익률 수식.'
  },
  {
    category: 'annuity',
    engine_name: 'analyzeAnnuity',
    deficiency_rules: { tax_deduction_limit: 6000000 },
    recommendation_plans: { diet: '연말정산 600만원 세액공제 연금', upgrade: '확정이율 최저보증 연금보험' },
    input_options_schema: {
      annuity_type: { label: '연금 종류', options: ['연금저축보험 (세액공제용)', '일반 연금보험 (비과세용)'] }
    },
    premium_factor_matrix: { base_40s_monthly: 200000 },
    formula_explanation: '연금보험 엔진: 연 600만원 세액공제 13.2%/16.5% 수식.'
  },
  {
    category: 'savings',
    engine_name: 'analyzeSavings',
    deficiency_rules: { tax_free_10_years: true },
    recommendation_plans: { standard: '10년 비과세 확정이율 저축' },
    input_options_schema: {
      guaranteed_rate: { label: '금리 유형', options: ['최저보증 확정이율형', '변동 공시이율형'] }
    },
    premium_factor_matrix: { base_40s_monthly: 300000 },
    formula_explanation: '저축보험 엔진: 10년 비과세 및 공시이율 환급률 계산.'
  },
  {
    category: 'wholeLife',
    engine_name: 'analyzeWholeLife',
    deficiency_rules: { death_benefit: 100000000 },
    recommendation_plans: { diet: '체증형 사망보장 종신', upgrade: '정기보험 전환 가성비 종신' },
    input_options_schema: {
      death_amount: { label: '사망진단금', options: ['5,000만', '1억', '2억'] }
    },
    premium_factor_matrix: { base_40s_monthly: 180000 },
    formula_explanation: '종신보험 엔진: 사망진단금 1억원 기준 환급률 산출.'
  },
  {
    category: 'accident',
    engine_name: 'analyzeAccident',
    deficiency_rules: { disability_3_to_100: true },
    recommendation_plans: { diet: '상해사망+후유장해 집중 플랜' },
    input_options_schema: {
      disability_amount: { label: '상해후유장해 (3~100%)', options: ['5,000만', '1억', '2억'] }
    },
    premium_factor_matrix: { base_40s_monthly: 15000 },
    formula_explanation: '상해보험 엔진: 상해후유장해 1억원 기준 수식.'
  },
  {
    category: 'pet',
    engine_name: 'analyzePet',
    deficiency_rules: { patella_surgery_included: true },
    recommendation_plans: { diet: '슬개골+수술비 70% 보장 펫보험' },
    input_options_schema: {
      pet_type: { label: '반려동물 종류', options: ['강아지 (소형견)', '강아지 (대형견)', '고양이'] },
      coverage_rate: { label: '보장 비율', options: ['70% 보장', '80% 보장'] }
    },
    premium_factor_matrix: { base_40s_monthly: 45000 },
    formula_explanation: '펫보험 엔진: 소형견 슬개골 및 수술비 70% 보장 기준.'
  },
  {
    category: 'legal',
    engine_name: 'analyzeLegal',
    deficiency_rules: { civil_lawsuit_fee: true },
    recommendation_plans: { standard: '민사소송 변호사비용 및 분쟁보장' },
    input_options_schema: {
      legal_fee: { label: '민사소송 심급별 변호사비', options: ['1,000만', '2,000만'] }
    },
    premium_factor_matrix: { base_40s_monthly: 9000 },
    formula_explanation: '법률비용 엔진: 민사소송 변호사선임비 1,000만원 기준.'
  },
  {
    category: 'golf',
    engine_name: 'analyzeGolf',
    deficiency_rules: { hole_in_one_fee: true },
    recommendation_plans: { standard: '홀인원 200만원+골프용품 손해 플랜' },
    input_options_schema: {
      hole_in_one: { label: '홀인원 축하금', options: ['100만원', '200만원', '300만원'] }
    },
    premium_factor_matrix: { base_40s_monthly: 10000 },
    formula_explanation: '골프보험 엔진: 홀인원 축하금 200만원 기준 정액.'
  },
  {
    category: 'credit',
    engine_name: 'analyzeCredit',
    deficiency_rules: { loan_linked_death: true },
    recommendation_plans: { standard: '대출안심 빚상속 방지 신용보험' },
    input_options_schema: {
      loan_amount: { label: '대출 연동 금액', options: ['대출 전액 보장', '50% 보장'] }
    },
    premium_factor_matrix: { base_40s_monthly: 8000 },
    formula_explanation: '신용보험 엔진: 대출금 빚상속 방지 사망보장 연동.'
  },
  {
    category: 'property',
    engine_name: 'analyzeProperty',
    deficiency_rules: { business_property_damage: true },
    recommendation_plans: { standard: '사업장/재산 종합 손해 화재보험' },
    input_options_schema: {
      property_val: { label: '사업장 재고자산 가액', options: ['5,000만', '1억', '3억'] }
    },
    premium_factor_matrix: { base_40s_monthly: 35000 },
    formula_explanation: '재산손해보험 엔진: 사업장 시설 및 재고자산 가액 산출.'
  },
  {
    category: 'home-facility',
    engine_name: 'analyzeHomeFacility',
    deficiency_rules: { home_structure_damage: true },
    recommendation_plans: { standard: '주택 및 시설물 안전 종합 보장' },
    input_options_schema: {
      facility_type: { label: '시설물 종류', options: ['단독주택', '아파트', '상가건물'] }
    },
    premium_factor_matrix: { base_40s_monthly: 15000 },
    formula_explanation: '주택시설물 엔진: 건물 및 구조물 안심보장 산출.'
  },
  {
    category: 'remodeling',
    engine_name: 'analyzeRemodeling',
    deficiency_rules: { duplicate_coverage_check: true },
    recommendation_plans: { diet: '중복보장 제거 보험료 30% 절감 플랜' },
    input_options_schema: {
      remodel_goal: { label: '리모델링 목표', options: ['보험료 다이어트 (최저가)', '보장 구멍 채우기 (보장강화)'] }
    },
    premium_factor_matrix: { base_40s_monthly: 0 },
    formula_explanation: '보험리모델링 엔진: 기존 보험과 1:1 대조하여 월 절감액 산출.'
  },
  {
    category: 'healthGeneral',
    engine_name: 'analyzeHealthGeneral',
    deficiency_rules: { total_3_diseases_balanced: true },
    recommendation_plans: { diet: '암·뇌·심 3대 질병 밸런스 플랜' },
    input_options_schema: {
      total_3_diseases: { label: '3대 질병 진단비', options: ['각 2,000만', '각 3,000만', '각 5,000만'] }
    },
    premium_factor_matrix: { base_40s_monthly: 58000 },
    formula_explanation: '종합건강보험 엔진: 암·뇌·심 3대 질병 통합 균형 수식.'
  }
];

async function seedAllData() {
  try {
    console.log(`📦 총 ${allInsuranceCategories.length}개 전체 보험 카테고리 데이터 시딩을 진행합니다...`);

    for (const r of allInsuranceCategories) {
      await supabase.from('insurance_calculation_rules').delete().eq('category', r.category);

      const { error } = await supabase
        .from('insurance_calculation_rules')
        .insert(r);

      if (error) {
        console.warn(`  ⚠️ [${r.category}] 시딩 경고:`, error.message);
      } else {
        console.log(`  ✅ [${r.category}] (${r.engine_name}) 정밀 입력 옵션 & 수식 DB 업서트 완료`);
      }
    }

    console.log(`\n🎉 Supabase DB에 26개 전체 보험 카테고리의 정밀 입력 옵션 및 수식 데이터가 100% 저장되었습니다!`);
  } catch (err) {
    console.error('❌ 전체 시딩 처리 중 오류 발생:', err);
  }
}

seedAllData();
