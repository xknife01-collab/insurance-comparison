-- ======================================================================
-- 🚀 PWA 웹 푸시 알림 연동 통합 SQL 설정 스크립트
-- ======================================================================
-- 이 스크립트를 Supabase [SQL Editor]에 붙여넣고 [Run]을 클릭해 주세요.
-- 설계사별 다중 기기 알림 구독 테이블 생성 및 신규 리드 유입 감지 웹훅을 구성합니다.
-- ======================================================================

-- 1. [테이블 생성] 설계사 푸시 구독 정보 저장 테이블
CREATE TABLE IF NOT EXISTS public.planner_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planner_id UUID NOT NULL REFERENCES public.planners(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL, -- 브라우저에서 생성한 PushSubscription 객체 전체 (endpoint, keys 등)
    device_info JSONB,          -- (선택) 기기 OS, 브라우저 정보 등 백업용
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. [인덱스 설정] 조회 속도 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_push_subs_planner_id 
    ON public.planner_push_subscriptions(planner_id);

-- 3. [보안 설정] Row Level Security (RLS) 활성화 및 정책 적용
ALTER TABLE public.planner_push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 존재할 경우 삭제
DROP POLICY IF EXISTS "Enable read/write access for all users" ON public.planner_push_subscriptions;

-- 모든 사용자(클라이언트 앱 포함)의 직접 입출력을 허용 (기존 planners 테이블 RLS 수준과 동일)
CREATE POLICY "Enable read/write access for all users" ON public.planner_push_subscriptions
    FOR ALL
    USING (true)
    WITH CHECK (true);


-- 4. [트리거 함수 설정] 신규 리드(customer_leads) 유입 시 Edge Function을 호출하는 웹훅
CREATE OR REPLACE FUNCTION public.handle_new_lead_push()
RETURNS TRIGGER AS $$
DECLARE
    project_url TEXT := 'https://wfkxwztxpugakusynhpx.supabase.co'; -- 프로젝트 고유 도메인
    service_role_key TEXT := 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; -- ⚠️ 이곳에 대표님의 Supabase Service Role Key를 입력해 주세요.
BEGIN
    -- pg_net 확장을 통해 백그라운드 비동기 HTTP POST 요청 전송
    PERFORM net.http_post(
        url := project_url || '/functions/v1/send-lead-push',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || service_role_key
        ),
        body := jsonb_build_object(
            'record', row_to_json(NEW)
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. [트리거 생성] customer_leads 테이블에 INSERT 발생 시 트리거 실행
DROP TRIGGER IF EXISTS trg_new_lead_push ON public.customer_leads;

CREATE TRIGGER trg_new_lead_push
    AFTER INSERT ON public.customer_leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_lead_push();

-- ======================================================================
-- 💡 설정 안내:
-- 1. 'YOUR_SUPABASE_SERVICE_ROLE_KEY' 부분을 Supabase 웹 대시보드
--    [Project Settings] -> [API] -> [service_role (secret) key] 값으로 치환하여 실행해 주세요.
-- 2. 이 SQL 스크립트 실행 후 Supabase Edge Function을 로컬에서 CLI로 배포하시면 연동이 즉시 완료됩니다.
-- ======================================================================
