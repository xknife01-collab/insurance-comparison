-- ============================================================================
-- 📌 [Supabase SQL 마이그레이션] 구글 실시간 웹 검색 지식 자동 적재 (Self-Growing KB)
-- ============================================================================

-- 1. insurance_knowledge_base 테이블 RLS 익명/인증 사용자 INSERT 정책 추가
DROP POLICY IF EXISTS "Allow anon and authenticated insert into knowledge base" ON public.insurance_knowledge_base;

CREATE POLICY "Allow anon and authenticated insert into knowledge base" 
ON public.insurance_knowledge_base 
FOR INSERT 
WITH CHECK (true);

-- 2. 자가 적재 카테고리('auto_search_grounding') 전용 탐색 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_kb_auto_search_category 
ON public.insurance_knowledge_base (category);

-- 3. 구글 자동 탐색 지식 전용 RPC 시맨틱 유사도 검색 프로시저 갱신
CREATE OR REPLACE FUNCTION public.match_auto_search_knowledge (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.25,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id bigint,
  category text,
  title text,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.category,
    kb.title,
    kb.content,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.insurance_knowledge_base kb
  WHERE kb.embedding IS NOT NULL
    AND (kb.category = 'auto_search_grounding' OR kb.category IS NOT NULL)
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
