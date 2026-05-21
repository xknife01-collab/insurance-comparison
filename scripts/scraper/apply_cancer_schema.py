import psycopg2
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

# Direct Pooler URL but using Transactional Port 6543 and SSL
DATABASE_URL = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411*@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

def apply_schema():
    print("[*] Applying Cancer schema to Supabase...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # SQL from db/schema.sql regarding Cancer
        sql = """
        -- [5] 암보험 전용 테이블
        CREATE TABLE IF NOT EXISTS public.insurance_cancer_products (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(100) NOT NULL,
            product_name VARCHAR(255) UNIQUE NOT NULL,
            category VARCHAR(50) DEFAULT '암',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS public.insurance_cancer_rates (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) REFERENCES public.insurance_cancer_products(product_name) ON DELETE CASCADE,
            gender CHAR(1) CHECK (gender IN ('M', 'F')),
            age INTEGER NOT NULL,
            premium INTEGER NOT NULL,
            benefit_name VARCHAR(255),
            benefit_amount VARCHAR(255),
            raw_data JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_cancer_rates_lookup ON public.insurance_cancer_rates (product_name, gender, age);

        -- Trigger function check
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_insurance_cancer_products_modtime ON public.insurance_cancer_products;
        CREATE TRIGGER update_insurance_cancer_products_modtime BEFORE UPDATE ON public.insurance_cancer_products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        
        DROP TRIGGER IF EXISTS update_insurance_cancer_rates_modtime ON public.insurance_cancer_rates;
        CREATE TRIGGER update_insurance_cancer_rates_modtime BEFORE UPDATE ON public.insurance_cancer_rates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
        """
        
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] Cancer tables ready in Supabase!")
        return True
    except Exception as e:
        print(f"  [!] Failed to apply schema: {e}")
        return False

if __name__ == "__main__":
    apply_schema()
