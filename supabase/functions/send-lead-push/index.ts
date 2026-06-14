import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import webPush from "npm:web-push";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // CORS 프리플라이트 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Supabase 클라이언트 초기화 (서비스 롤 키로 권한 우회 쿼리 수행)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 2. VAPID 웹푸시 설정 로드
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:support@insurance-comparison.com';

    if (vapidPublicKey && vapidPrivateKey) {
      webPush.setVapidDetails(
        vapidSubject,
        vapidPublicKey,
        vapidPrivateKey
      );
    } else {
      console.warn("⚠️ VAPID 키 쌍이 Supabase 환경변수에 설정되어 있지 않습니다.");
    }

    // 3. 페이로드 바디 파싱
    const body = await req.json();
    const { record, is_test, planner_id: testPlannerId } = body;

    let targetPlannerIds: string[] = [];
    let leadName = '';
    let insuranceType = '';
    let monthlyPremium = 0;
    const isTest = !!is_test;

    if (isTest && testPlannerId) {
      // (Case A) 설정 페이지에서의 테스트 푸시 발송인 경우
      targetPlannerIds = [testPlannerId];
    } else if (record) {
      // (Case B) 신규 리드 유입 웹훅 트리거인 경우
      leadName = record.name || '고객';
      insuranceType = record.insurance_type || '';
      monthlyPremium = record.monthly_premium || 0;

      if (record.planner_id) {
        // 특정 설계사 단독 배정
        targetPlannerIds = [record.planner_id];
      } else if (record.agency_id) {
        // 대리점 공용 풀인 경우 -> 해당 대리점 소속 관리자 설계사들(is_admin = true)에게 일괄 발송
        const { data: admins, error: adminErr } = await supabase
          .from('planners')
          .select('id')
          .eq('agency_id', record.agency_id)
          .eq('is_admin', true);

        if (!adminErr && admins) {
          targetPlannerIds = admins.map(admin => admin.id);
        }
      }
    }

    if (targetPlannerIds.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "푸시를 보낼 수신 대상 설계사가 없습니다." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 4. 대상 설계사들의 웹푸시 구독 목록 조회
    const { data: subscriptions, error: subErr } = await supabase
      .from('planner_push_subscriptions')
      .select('*')
      .in('planner_id', targetPlannerIds);

    if (subErr || !subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "등록된 기기 웹푸시 토큰이 없습니다." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 5. 상품 한글 이름 매핑 헬퍼
    const getInsuranceName = (type: string) => {
      switch (type) {
        case 'remodeling':
        case 'remodeling_consult': return '내 보험 분석';
        case 'car':
        case 'car_consult': return '자동차 비교';
        case 'child':
        case 'child_consult': return '태아/어린이 보험';
        case 'driver':
        case 'driver_consult': return '운전자 보험';
        case 'dementia':
        case 'dementia_consult': return '치매/간병 보험';
        case 'fire':
        case 'fire_consult': return '화재 보험';
        case 'dental':
        case 'dental_consult': return '치아 보험';
        case 'whole':
        case 'whole_consult': return '종신 보험';
        case 'savings':
        case 'savings_consult': return '저축 보험';
        case 'pet':
        case 'pet_consult': return '펫 보험';
        default: return '맞춤 보장 진단';
      }
    };

    // 6. 알림 전송 페이로드 구성
    const pushPayload = JSON.stringify({
      title: isTest ? "🔔 푸시 알림 테스트 성공!" : "🚀 신규 고객 리드 유입!",
      body: isTest
        ? "설계사 콘솔의 실시간 웹 푸시 파이프라인이 정상적으로 구축 완료되었습니다."
        : `이름: ${leadName}님 | 상품: ${getInsuranceName(insuranceType)}\n월 납입액: ${monthlyPremium.toLocaleString('ko-KR')}원`,
      url: "/admin?tab=leads" // 클릭 시 대시보드 리드 탭으로 리다이렉트
    });

    // 7. 웹푸시 병렬 전송 및 불필요(만료) 토큰 즉시 프루닝(Pruning)
    const sendPromises = subscriptions.map(async (subRecord) => {
      try {
        await webPush.sendNotification(
          subRecord.subscription,
          pushPayload
        );
      } catch (err: any) {
        console.error(`🔴 Subscription [${subRecord.id}] 발송 실패:`, err);
        
        // 토큰이 더 이상 유효하지 않거나 만료된 경우 (410 Gone 또는 404 Not Found) DB에서 즉시 제거
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`🧹 만료된 기기 구독 토큰 삭제 처리: ${subRecord.id}`);
          await supabase
            .from('planner_push_subscriptions')
            .delete()
            .eq('id', subRecord.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return new Response(
      JSON.stringify({ success: true, sent_count: subscriptions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (err: any) {
    console.error("🔴 Edge Function 오류 발생:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || String(err) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
