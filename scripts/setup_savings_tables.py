import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

DB_URL = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411*@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

def create_savings_tables():
    print("[*] Creating savings_products table in Supabase...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Create public.savings_products table
        cur.execute("""
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
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        """)
        
        # Create index
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_savings_products_lookup 
        ON public.savings_products (product_name, saving_type);
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] savings_products table created successfully!")
        return True
    except Exception as e:
        print(f"  [!] Failed to create savings tables: {e}")
        return False

if __name__ == "__main__":
    create_savings_tables()
