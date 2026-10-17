-- ==========================================================
-- visitor_logs 컬럼 확장 (Supabase SQL Editor에서 직접 실행)
-- 기존 컬럼/데이터는 건드리지 않습니다. 전부 NULL 허용, 기본값 없음.
-- ==========================================================
ALTER TABLE public.visitor_logs
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS path text,
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

-- ----------------------------------------------------------
-- [확인용] 현재 RLS 정책 조회 (먼저 이걸 실행해서 결과를 확인하세요)
-- insert 정책이 보이면 아래 CREATE POLICY 는 실행하지 않아도 됩니다.
-- ----------------------------------------------------------
-- SELECT policyname, cmd, roles, with_check
--   FROM pg_policies WHERE tablename = 'visitor_logs';

-- ----------------------------------------------------------
-- [정책이 없을 때만 실행] 익명 사용자 INSERT 허용
-- ----------------------------------------------------------
-- CREATE POLICY "anon can insert visitor_logs"
--   ON public.visitor_logs FOR INSERT TO anon WITH CHECK (true);
