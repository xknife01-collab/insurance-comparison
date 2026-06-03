const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Service Role Key not found in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
CREATE TABLE IF NOT EXISTS public.variable_products (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL UNIQUE,
    sub_type VARCHAR(50) NOT NULL, -- 'term' (정기/종신) 또는 'investment' (저축/연금)
    male_premium_40 INTEGER DEFAULT 0, -- 40세 남성 기준 월보험료 (term 전용)
    female_premium_40 INTEGER DEFAULT 0, -- 40세 여성 기준 월보험료 (term 전용)
    declared_rate NUMERIC DEFAULT 0, -- 적용이율 혹은 기대수익률 (%)
    business_fee NUMERIC DEFAULT 0, -- 사업비 또는 수수료 (%)
    features TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variable_products_lookup ON public.variable_products (product_name, sub_type);
`;

async function run() {
  console.log('[*] Creating variable_products table via exec_sql RPC...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('[ERR] SQL EXECUTION FAILED:', error);
    process.exit(1);
  }
  console.log('[OK] variable_products table created successfully!');
}

run();
