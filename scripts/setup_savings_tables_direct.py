import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

def main():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in environment.")
        return
        
    print(f"[*] Connecting to database using URL from env: {db_url[:40]}...")
    try:
        conn = psycopg2.connect(db_url)
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
    except Exception as e:
        print(f"  [!] Failed to connect or create table: {e}")

if __name__ == "__main__":
    main()
