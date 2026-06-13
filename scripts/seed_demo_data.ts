import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting demo data seeding in Supabase using UUIDs...');

  // Valid UUID v4s for seeding
  const demoAgencyId = '88888888-8888-4888-a888-888888888888';
  const demoAgencyPlannerId = '11111111-1111-4111-a111-111111111111';
  const demoPlannerId = '22222222-2222-4222-a222-222222222222';
  const demoP1 = '33333333-3333-4333-a333-333333333333';
  const demoP2 = '44444444-4444-4444-a444-444444444444';
  const demoP3 = '55555555-5555-4555-a555-555555555555';
  const demoP4 = '66666666-6666-4666-a666-666666666666';

  // 1. Clean up old demo records if any exist
  console.log('Cleaning up existing demo leads...');
  await supabase.from('customer_leads').delete().eq('agency_id', demoAgencyId);
  await supabase.from('customer_leads').delete().eq('planner_id', demoPlannerId);
  
  console.log('Cleaning up existing demo planners...');
  await supabase.from('planners').delete().eq('agency_id', demoAgencyId);
  await supabase.from('planners').delete().eq('id', demoPlannerId);
  
  console.log('Cleaning up existing demo agency...');
  await supabase.from('agencies').delete().eq('id', demoAgencyId);

  // 2. Upsert Demo Agency
  console.log('Upserting demo agency...');
  const { error: agencyErr } = await supabase
    .from('agencies')
    .upsert({
      id: demoAgencyId,
      name: '스마트보험파트너스 데모 대리점',
      subscription_status: 'active',
      subscription_tier: 'pro',
      max_planner_limit: 28,
      current_credits: 153000,
      lead_routing_type: 'distribute_auto_round_robin',
      logo_url: '/logo.png',
      email: 'demo@insurance-partner.com',
      phone: '02-1234-5678',
      address: '서울시 강남구 테헤란로 123',
      is_demo: true
    }, { onConflict: 'id' });

  if (agencyErr) {
    console.error('Error upserting agency:', agencyErr.message);
  } else {
    console.log('Demo agency upserted successfully.');
  }

  // 3. Upsert Demo Planners
  console.log('Upserting demo planners...');
  const plannersList = [
    { 
      id: demoAgencyPlannerId, 
      agency_id: demoAgencyId, 
      name: '대리점 체험대표', 
      planner_code: 'test', 
      phone: '010-0000-0000', 
      is_admin: true, 
      subscription_status: 'active', 
      registration_number: 'dist_weight:10', 
      monthly_credit_used: 50, 
      monthly_credit_quota: 200,
      company_name: '스마트보험파트너스 데모 대리점',
      custom_phone: '010-0000-0000',
      custom_address: '서울시 강남구 테헤란로 123',
      password: '1234',
      email: 'demo@insurance-partner.com',
      greeting_title: '대리점 체험대표',
      greeting_content: '안녕하세요. 최고의 맞춤형 보험 비교 분석 서비스를 제공합니다.'
    },
    { 
      id: demoPlannerId, 
      agency_id: null, 
      name: '설계사 체험설계', 
      planner_code: 'test_planner', 
      phone: '010-5555-6666', 
      is_admin: false, 
      subscription_status: 'active', 
      registration_number: 'dist_weight:10', 
      monthly_credit_used: 40, 
      monthly_credit_quota: 200,
      company_name: '개인 스마트 설계사',
      custom_phone: '010-5555-6666',
      custom_address: '서울시 서초구 서초대로 456',
      password: '1234',
      email: 'planner_demo@insurance-partner.com',
      greeting_title: '설계사 체험설계',
      greeting_content: '고객님의 미래를 설계하는 맞춤형 보험 분석 파트너입니다.'
    },
    { 
      id: demoP1, 
      agency_id: demoAgencyId, 
      name: '김설계', 
      planner_code: 'p1', 
      phone: '010-1111-2222', 
      is_admin: false, 
      subscription_status: 'active', 
      registration_number: 'dist_weight:8', 
      monthly_credit_used: 120, 
      monthly_credit_quota: 300,
      company_name: '스마트보험파트너스 데모 대리점',
      custom_phone: '010-1111-2222',
      custom_address: '서울시 강남구 테헤란로 123',
      password: '1234'
    },
    { 
      id: demoP2, 
      agency_id: demoAgencyId, 
      name: '이보장', 
      planner_code: 'p2', 
      phone: '010-2222-3333', 
      is_admin: false, 
      subscription_status: 'active', 
      registration_number: 'dist_weight:5', 
      monthly_credit_used: 85, 
      monthly_credit_quota: 250,
      company_name: '스마트보험파트너스 데모 대리점',
      custom_phone: '010-2222-3333',
      custom_address: '서울시 강남구 테헤란로 123',
      password: '1234'
    },
    { 
      id: demoP3, 
      agency_id: demoAgencyId, 
      name: '박보험', 
      planner_code: 'p3', 
      phone: '010-3333-4444', 
      is_admin: false, 
      subscription_status: 'active', 
      registration_number: 'dist_disabled', 
      monthly_credit_used: 0, 
      monthly_credit_quota: 100,
      company_name: '스마트보험파트너스 데모 대리점',
      custom_phone: '010-3333-4444',
      custom_address: '서울시 강남구 테헤란로 123',
      password: '1234'
    },
    { 
      id: demoP4, 
      agency_id: demoAgencyId, 
      name: '최분석', 
      planner_code: 'p4', 
      phone: '010-4444-5555', 
      is_admin: false, 
      subscription_status: 'active', 
      registration_number: 'dist_weight:10', 
      monthly_credit_used: 150, 
      monthly_credit_quota: 500,
      company_name: '스마트보험파트너스 데모 대리점',
      custom_phone: '010-4444-5555',
      custom_address: '서울시 강남구 테헤란로 123',
      password: '1234'
    }
  ];

  for (const p of plannersList) {
    const { error: plannerErr } = await supabase
      .from('planners')
      .upsert({ ...p, is_demo: true }, { onConflict: 'id' });
    if (plannerErr) {
      console.error(`Error upserting planner ${p.name}:`, plannerErr.message);
    } else {
      console.log(`Planner ${p.name} upserted successfully.`);
    }
  }

  // Common Remodeling policy definitions for realistic display
  const remodelingPoliciesHong = {
    current_total_premium: 280000,
    policies: [
      {
        insurance_company: "삼성생명",
        product_name: "무배당 삼성종신보험",
        monthly_premium: 150000,
        riders: [
          { rider_name: "일반사망보장", coverage_amount: 100000000 },
          { rider_name: "암진단특약", coverage_amount: 30000000 },
          { rider_name: "뇌출혈진단특약", coverage_amount: 20000000 },
          { rider_name: "급성심근경색특약", coverage_amount: 20000000 }
        ]
      },
      {
        insurance_company: "메리츠화재",
        product_name: "무배당 메리츠알파건강보험",
        monthly_premium: 130000,
        riders: [
          { rider_name: "암진단비(유사암제외)", coverage_amount: 50000000 },
          { rider_name: "유사암진단비", coverage_amount: 10000000 },
          { rider_name: "뇌혈관질환진단비", coverage_amount: 20000000 },
          { rider_name: "허혈성심장질환진단비", coverage_amount: 20000000 },
          { rider_name: "질병수술비", coverage_amount: 5000000 }
        ]
      }
    ]
  };

  const remodelingPoliciesSim = {
    current_total_premium: 195000,
    policies: [
      {
        insurance_company: "교보생명",
        product_name: "무배당 교보실손종합보장보험",
        monthly_premium: 95000,
        riders: [
          { rider_name: "상해사망", coverage_amount: 50000000 },
          { rider_name: "질병사망", coverage_amount: 30000000 },
          { rider_name: "상해입원일당", coverage_amount: 30000 }
        ]
      },
      {
        insurance_company: "현대해상",
        product_name: "무배당 현대태아안심보험",
        monthly_premium: 100000,
        riders: [
          { rider_name: "암진단비", coverage_amount: 30000000 },
          { rider_name: "뇌혈관진단비", coverage_amount: 20000000 },
          { rider_name: "허혈성심장진단비", coverage_amount: 20000000 }
        ]
      }
    ]
  };

  const remodelingPoliciesLim = {
    current_total_premium: 450000,
    policies: [
      {
        insurance_company: "한화생명",
        product_name: "무배당 한화종신보장보험",
        monthly_premium: 250000,
        riders: [
          { rider_name: "일반사망", coverage_amount: 200000000 },
          { rider_name: "암수술비", coverage_amount: 5000000 }
        ]
      },
      {
        insurance_company: "DB손해보험",
        product_name: "무배당 DB참좋은훼밀리건강보험",
        monthly_premium: 200000,
        riders: [
          { rider_name: "암진단비", coverage_amount: 50000000 },
          { rider_name: "뇌혈관진단비", coverage_amount: 30000000 },
          { rider_name: "허혈성심장진단비", coverage_amount: 30000000 },
          { rider_name: "상해후유장해", coverage_amount: 100000000 }
        ]
      }
    ]
  };

  const remodelingPoliciesHeung = {
    current_total_premium: 128000,
    policies: [
      {
        insurance_company: "KB손해보험",
        product_name: "무배당 KB간편건강보험",
        monthly_premium: 128000,
        riders: [
          { rider_name: "암진단비", coverage_amount: 20000000 },
          { rider_name: "뇌출혈진단비", coverage_amount: 10000000 },
          { rider_name: "급성심근경색진단비", coverage_amount: 10000000 }
        ]
      }
    ]
  };

  // 4. Upsert Demo Customer Leads
  console.log('Upserting demo customer leads...');
  const leadsList = [
    {
      id: 9901,
      agency_id: demoAgencyId,
      planner_id: demoP1,
      name: '홍길동',
      phone: '010-9999-8888',
      age: 45,
      insurance_type: 'remodeling',
      monthly_premium: 280000,
      status: 'consulting',
      lead_source: 'remodeling',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'instagram',
        simulation_code: 'SIM-REMOD-01',
        company: '삼성생명',
        email: 'gildong@naver.com',
        analysisInputs: {
          _remodelingCoverage: remodelingPoliciesHong
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '고객 분석 보고서 작성 시도', created_at: new Date(Date.now() - 3600000).toISOString() }
        ]
      }
    },
    {
      id: 9902,
      agency_id: demoAgencyId,
      planner_id: demoP2,
      name: '성춘향',
      phone: '010-8888-7777',
      age: 32,
      insurance_type: 'cancer',
      monthly_premium: 85000,
      status: 'new',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      raw_payload: {
        gender: 'F',
        utm_source: 'naver',
        simulation_code: 'SIM-CANCER-02',
        company: '메리츠화재',
        email: 'chunhyang@daum.net',
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '암보험 신규 분석 완료', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]
      }
    },
    {
      id: 9903,
      agency_id: demoAgencyId,
      planner_id: demoP4,
      name: '이몽룡',
      phone: '010-7777-6666',
      age: 28,
      insurance_type: 'driver',
      monthly_premium: 32000,
      status: 'completed',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'facebook',
        simulation_code: 'SIM-DRIVER-03',
        company: 'DB손해보험',
        email: 'mongryong@gmail.com',
        timeline: [
          { id: '1', type: 'status_change', author: '최분석', detail: '운전자보험 상담 완료 및 청약 가입', created_at: new Date(Date.now() - 40000000).toISOString() }
        ]
      }
    },
    {
      id: 9904,
      agency_id: demoAgencyId,
      planner_id: demoP1,
      name: '심청',
      phone: '010-5555-4444',
      age: 24,
      insurance_type: 'remodeling_consult',
      monthly_premium: 195000,
      status: 'new',
      lead_source: 'kakaotalk',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      raw_payload: {
        gender: 'F',
        utm_source: 'kakaotalk',
        simulation_code: 'SIM-REMOD-04',
        company: '교보생명',
        email: 'cheong@naver.com',
        analysisInputs: {
          _remodelingCoverage: remodelingPoliciesSim
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '카카오톡 정밀 리모델링 상담 요청 접수', created_at: new Date(Date.now() - 1800000).toISOString() }
        ]
      }
    },
    {
      id: 9905,
      agency_id: demoAgencyId,
      planner_id: demoP2,
      name: '임꺽정',
      phone: '010-6666-5555',
      age: 50,
      insurance_type: 'cancer_consult',
      monthly_premium: 145000,
      status: 'consulting',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 43200000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'google_ads',
        simulation_code: 'SIM-CANCER-05',
        company: '한화손해보험',
        email: 'kkukjung@daum.net',
        timeline: [
          { id: '1', type: 'status_change', author: '이보장', detail: '상담전화 연결 및 통화 진행 중', created_at: new Date(Date.now() - 20000000).toISOString() }
        ]
      }
    },
    {
      id: 9906,
      agency_id: demoAgencyId,
      planner_id: demoP4,
      name: '장보고',
      phone: '010-4444-3333',
      age: 38,
      insurance_type: 'support_consult',
      monthly_premium: 0,
      status: 'new',
      lead_source: 'support',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'organic',
        company: '해상무역진흥',
        email: 'bogo@trade.com',
        subject: '대리점 단체 구독 크레딧 자동 배분 문의',
        message: '대리점 Pro 등급 가입 시 소속 설계사들에게 크레딧이 자동으로 매달 분배되는 방식과 가중치 분배 방식 차이를 더 자세히 설명해 주세요.',
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '1:1 고객센터 상담 문의가 성공적으로 접수되었습니다.', created_at: new Date(Date.now() - 10800000).toISOString() }
        ]
      }
    },
    {
      id: 9907,
      agency_id: demoAgencyId,
      planner_id: null,
      name: '놀부',
      phone: '010-3333-2222',
      age: 55,
      insurance_type: 'cancer_consult',
      monthly_premium: 190000,
      status: 'new',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 1200000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'naver',
        simulation_code: 'SIM-CANCER-07',
        company: '삼성화재',
        email: 'nolbu@greedy.com',
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '공용 유입 DB 수동 배정 풀(Manual Pool) 대기 중', created_at: new Date(Date.now() - 1200000).toISOString() }
        ]
      }
    },
    {
      id: 9908,
      agency_id: demoAgencyId,
      planner_id: demoP2,
      name: '흥부',
      phone: '010-2222-1111',
      age: 52,
      insurance_type: 'cancer_underwriting',
      monthly_premium: 98000,
      status: 'new',
      lead_source: 'underwriting',
      created_at: new Date(Date.now() - 5000000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'instagram',
        simulation_code: 'SIM-CANCER-08',
        company: 'KB손해보험',
        email: 'heungbu@good.com',
        underwriting: {
          disease_history: '고혈압 약 복용 중 (3년)',
          additional_notes: '현재 약 복용 외에 다른 합병증이나 수술 이력은 전혀 없습니다.'
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '가입 사전심사 신청 접수 완료', created_at: new Date(Date.now() - 5000000).toISOString() }
        ]
      }
    },
    // New Whole Life Leads (김종신 & 박종신)
    {
      id: 9909,
      agency_id: demoAgencyId,
      planner_id: demoP1,
      name: '김종신',
      phone: '010-1234-5678',
      age: 40,
      insurance_type: 'whole',
      monthly_premium: 180000,
      status: 'new',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'naver',
        simulation_code: 'SIM-WHOLE-09',
        email: 'jongshin@gmail.com',
        analysisInputs: {
          wholeLife: {
            isStepUp: false,
            objective: 'savings',
            refundType: 'low',
            deathBenefit: 200000000
          }
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 상세 설계 비교분석 완료', created_at: new Date(Date.now() - 7200000).toISOString() }
        ]
      }
    },
    {
      id: 9910,
      agency_id: demoAgencyId,
      planner_id: demoP2,
      name: '박종신',
      phone: '010-8765-4321',
      age: 35,
      insurance_type: 'whole_consult',
      monthly_premium: 220000,
      status: 'new',
      lead_source: 'kakaotalk',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      raw_payload: {
        gender: 'F',
        utm_source: 'google_ads',
        simulation_code: 'SIM-WHOLE-10',
        email: 'parkjs@naver.com',
        analysisInputs: {
          wholeLife: {
            isStepUp: true,
            objective: 'family',
            refundType: 'standard',
            deathBenefit: 150000000
          }
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 카카오톡 상담 요청 접수 완료', created_at: new Date(Date.now() - 14400000).toISOString() }
        ]
      }
    },
    // Planner Leads
    {
      id: 9911,
      agency_id: null,
      planner_id: demoPlannerId,
      name: '임꺽정',
      phone: '010-6666-5555',
      age: 50,
      insurance_type: 'remodeling',
      monthly_premium: 450000,
      status: 'new',
      lead_source: 'remodeling',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'instagram',
        simulation_code: 'SIM-REMOD-11',
        company: '삼성생명',
        email: 'kkukjung@daum.net',
        analysisInputs: {
          _remodelingCoverage: remodelingPoliciesLim
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '보험료 다이어트 분석 시도', created_at: new Date(Date.now() - 1800000).toISOString() }
        ]
      }
    },
    {
      id: 9912,
      agency_id: null,
      planner_id: demoPlannerId,
      name: '심청',
      phone: '010-5555-4444',
      age: 24,
      insurance_type: 'driver',
      monthly_premium: 25000,
      status: 'consulting',
      lead_source: 'compare',
      created_at: new Date(Date.now() - 43200000).toISOString(),
      raw_payload: {
        gender: 'F',
        utm_source: 'naver',
        simulation_code: 'SIM-DRIVER-12',
        company: 'KB손해보험',
        email: 'cheong@naver.com',
        timeline: [
          { id: '1', type: 'status_change', author: '설계사 체험설계', detail: '전화 상담 시작', created_at: new Date(Date.now() - 20000000).toISOString() }
        ]
      }
    },
    {
      id: 9913,
      agency_id: null,
      planner_id: demoPlannerId,
      name: '흥부',
      phone: '010-2222-1111',
      age: 48,
      insurance_type: 'remodeling_consult',
      monthly_premium: 128000,
      status: 'new',
      lead_source: 'remodeling',
      created_at: new Date(Date.now() - 600000).toISOString(),
      raw_payload: {
        gender: 'M',
        utm_source: 'kakaotalk',
        simulation_code: 'SIM-REMOD-13',
        company: '메리츠화재',
        email: 'heungbu@gmail.com',
        analysisInputs: {
          _remodelingCoverage: remodelingPoliciesHeung
        },
        timeline: [
          { id: '1', type: 'status_change', author: '시스템', detail: '카톡 정밀 상담 요청 접수', created_at: new Date(Date.now() - 600000).toISOString() }
        ]
      }
    }
  ];

  for (const l of leadsList) {
    const { error: leadErr } = await supabase
      .from('customer_leads')
      .upsert({ ...l, is_demo: true }, { onConflict: 'id' });
    if (leadErr) {
      console.error(`Error upserting lead ${l.name}:`, leadErr.message);
    } else {
      console.log(`Lead ${l.name} upserted successfully.`);
    }
  }

  console.log('Seeding finished successfully!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
});
