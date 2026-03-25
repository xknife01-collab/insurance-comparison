-- [1] 보험 상품 마스터 정보
CREATE TABLE IF NOT EXISTS public.insurance_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) UNIQUE NOT NULL, -- 예: MERITZ_CANCER_V1
    company_name VARCHAR(100) NOT NULL,       -- 예: 메리츠화재
    display_name VARCHAR(200),                 -- 사용자 노출용 상품명
    standard_code VARCHAR(50) NOT NULL,        -- 내부 표준 코드 (예: STD_CANCER_01)
    category VARCHAR(50),                      -- 암, 뇌, 심장, 실비 등
    is_renewable BOOLEAN DEFAULT FALSE,        -- 갱신형 여부
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [2] 보험 요율(Rate) 데이터 (JSONB 활용)
-- 성별 x 나이 x 직업급수별로 모든 담보의 요율을 한 레코드에 담습니다.
CREATE TABLE IF NOT EXISTS public.insurance_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) REFERENCES public.insurance_products(product_code) ON DELETE CASCADE,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    age INTEGER NOT NULL,
    job_class INTEGER DEFAULT 1, -- 1급, 2급, 3급
    -- rate_data 예시: { "cancer_diag_3000": 12050, "cancer_recur_1000": 5400 }
    rate_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [3] 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_rates_lookup ON public.insurance_rates (product_code, gender, age, job_class);
CREATE INDEX IF NOT EXISTS idx_rates_jsonb_data ON public.insurance_rates USING GIN (rate_data);

-- [4] 트리거: 내용 변경 시 updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_insurance_products_modtime BEFORE UPDATE ON public.insurance_products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_insurance_rates_modtime BEFORE UPDATE ON public.insurance_rates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
