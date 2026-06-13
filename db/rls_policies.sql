-- ======================================================================
-- 🚀 B2B SaaS 테이블 Row Level Security (RLS) 및 보안 정책 설정 SQL
-- ======================================================================
-- 이 스크립트를 Supabase [SQL Editor]에 붙여넣고 [Run]을 클릭해 주세요.
-- 고객의 브라우저(비로그인 상태)에서 브랜딩 정보를 읽고 상담 신청(Lead)을 
-- 등록할 수 있도록 허용하는 필수 보안 설정입니다.
-- ======================================================================
-- 1. RLS 활성화 (테이블 보호)
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- 1.5. 비밀번호 컬럼 추가 (설계사 로그인 보안 강화)
ALTER TABLE public.planners ADD COLUMN IF NOT EXISTS password text;

-- 2. 기존 정책 삭제 (중복 생성 방지)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.agencies;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.agencies;
DROP POLICY IF EXISTS "Enable update for all users" ON public.agencies;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.planners;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.planners;
DROP POLICY IF EXISTS "Enable update for all users" ON public.planners;

DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.customer_leads;
DROP POLICY IF EXISTS "Enable read for planners/agencies" ON public.customer_leads;
DROP POLICY IF EXISTS "Enable update for all users" ON public.customer_leads;

-- ==========================================
-- 🏢 3. 대리점(agencies) 테이블 정책
-- ==========================================
-- 조회: 누구나 (로고/전화번호 연동용)
CREATE POLICY "Enable read access for all users" ON public.agencies
    FOR SELECT USING (true);

-- 삽입: 누구나 (신규 대리점 가입 신청용)
CREATE POLICY "Enable insert for all users" ON public.agencies
    FOR INSERT WITH CHECK (true);

-- 수정: 누구나 (대리점 설정 변경 및 모의 구독 결제 연장용)
CREATE POLICY "Enable update for all users" ON public.agencies
    FOR UPDATE USING (true) WITH CHECK (true);


-- ==========================================
-- 💼 4. 설계사(planners) 테이블 정책
-- ==========================================
-- 조회: 누구나 (프로필/인사말 연동용)
CREATE POLICY "Enable read access for all users" ON public.planners
    FOR SELECT USING (true);

-- 삽입: 누구나 (신규 설계사 가입 신청용)
CREATE POLICY "Enable insert for all users" ON public.planners
    FOR INSERT WITH CHECK (true);

-- 수정: 누구나 (개인 정보 수정 및 모의 구독 결제 연장용)
CREATE POLICY "Enable update for all users" ON public.planners
    FOR UPDATE USING (true) WITH CHECK (true);


-- ==========================================
-- 📄 5. 고객 리드(customer_leads) 테이블 정책
-- ==========================================
-- 삽입: 누구나 (고객이 상담 신청 버튼 클릭 시 등록용)
CREATE POLICY "Enable insert for anonymous users" ON public.customer_leads
    FOR INSERT WITH CHECK (true);

-- 조회: 누구나 (어드민 대시보드 리드 목록 조회용)
CREATE POLICY "Enable read for planners/agencies" ON public.customer_leads
    FOR SELECT USING (true);

-- 수정: 누구나 (어드민 대시보드 상담 상태 수정 및 설계사 배정용)
CREATE POLICY "Enable update for all users" ON public.customer_leads
    FOR UPDATE USING (true) WITH CHECK (true);


-- ==========================================
-- 📊 6. 방문 기록(visitor_logs) 테이블 정책
-- ==========================================
CREATE TABLE IF NOT EXISTS public.visitor_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    planner_code text NOT NULL,
    utm_source text DEFAULT 'organic',
    session_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 활성화
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- 삽입: 누구나 (비로그인 상태 방문 기록 등록용)
CREATE POLICY "Enable insert for anonymous users" ON public.visitor_logs
    FOR INSERT WITH CHECK (true);

-- 조회: 누구나 (어드민 대시보드 통계 집계용)
CREATE POLICY "Enable read for all users" ON public.visitor_logs
    FOR SELECT USING (true);
