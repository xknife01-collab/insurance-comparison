import psycopg2
import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

DB_URL = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411*@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

def create_variable_tables():
    print("[*] Creating Variable & Term Insurance tables in Supabase...")
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Create public.variable_products table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS public.variable_products (
            id SERIAL PRIMARY KEY,
            company VARCHAR(100) NOT NULL,
            product_name VARCHAR(255) NOT NULL UNIQUE,
            sub_type VARCHAR(50) NOT NULL, -- 'term' or 'investment'
            male_premium_40 INTEGER DEFAULT 0,
            female_premium_40 INTEGER DEFAULT 0,
            declared_rate NUMERIC DEFAULT 0,
            business_fee NUMERIC DEFAULT 0,
            features TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        """)
        
        # Create index
        cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_variable_products_lookup 
        ON public.variable_products (product_name, sub_type);
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] variable_products table created successfully!")
        return True
    except Exception as e:
        print(f"  [!] Failed to create variable tables: {e}")
        return False

if __name__ == "__main__":
    create_variable_tables()
