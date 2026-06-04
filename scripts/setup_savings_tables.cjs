const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sql = `
CREATE TABLE IF NOT EXISTS public.savings_products (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    period VARCHAR(50),
    accum_premium VARCHAR(100),
    surrender_value NUMERIC DEFAULT 0,
    refund_rate NUMERIC DEFAULT 0,
    interest_rate VARCHAR(50),
    channel VARCHAR(100),
    base_date VARCHAR(50),
    description TEXT,
    contact VARCHAR(100),
    source_file VARCHAR(255),
    features TEXT,
    saving_type VARCHAR(50) NOT NULL, -- 'installment' or 'lumpSum'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_savings_products_lookup ON public.savings_products (product_name, saving_type);
`;

async function run() {
  console.log('[*] Creating savings_products table via Supabase RPC...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('[ERR] SQL EXECUTION FAILED:', error);
    process.exit(1);
  }
  console.log('[OK] savings_products table created successfully!');
}

run();
