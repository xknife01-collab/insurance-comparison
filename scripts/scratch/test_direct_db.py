import psycopg2

DIRECT_URL = "postgresql://postgres:rlaghddlf0411*@db.wfkxwztxpugakusynhpx.supabase.co:5432/postgres"

def main():
    print("[*] Connecting to direct DB host...")
    try:
        conn = psycopg2.connect(DIRECT_URL)
        cur = conn.cursor()
        print("[+] Connected successfully!")
        
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
        print("[+] Created table savings_products!")
        
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_savings_products_lookup 
        ON public.savings_products (product_name, saving_type);
        """)
        print("[+] Created index idx_savings_products_lookup!")
        
        conn.commit()
        cur.close()
        conn.close()
        print("[+] Done!")
    except Exception as e:
        print(f"[-] Failed: {e}")

if __name__ == "__main__":
    main()
