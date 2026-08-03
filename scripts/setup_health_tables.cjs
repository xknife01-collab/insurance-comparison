const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sql = `
DO $$
BEGIN
    -- 1. 건강보험 전용 테이블 생성
    CREATE TABLE IF NOT EXISTS public.health_products (
        product_code text PRIMARY KEY,
        display_name text NOT NULL,
        company_name text NOT NULL,
        created_at timestamptz DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS public.health_rates (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_code text REFERENCES public.health_products(product_code) ON DELETE CASCADE,
        gender text NOT NULL,
        age integer NOT NULL,
        rate_data jsonb NOT NULL,
        created_at timestamptz DEFAULT now()
    );

    -- 2. 인덱스 생성
    CREATE INDEX IF NOT EXISTS idx_health_rates_age ON public.health_rates(age);
    CREATE INDEX IF NOT EXISTS idx_health_rates_gender ON public.health_rates(gender);
    CREATE INDEX IF NOT EXISTS idx_health_rates_prod_code ON public.health_rates(product_code);
    
    RAISE NOTICE 'Health Tables Created Successfully!';
END $$;
`;

async function run() {
  console.log('[*] STARTING HEALTH VAULT CREATION...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('[ERR] SQL EXECUTION FAILED:', error);
    process.exit(1);
  }
  console.log('[OK] HEALTH VAULT IS NOW OPEN AND SECURE!');
}

run();
