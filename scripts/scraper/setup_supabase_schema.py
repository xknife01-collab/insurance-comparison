import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

# 직접 DB 호스트로 접속 시도
def create_schema_direct():
    print("[*] Direct DB 호스트로 스키마 생성 시도...")
    host = "db.wfkxwztxpugakusynhpx.supabase.co"
    user = "postgres"
    password = "rlaghddlf0411*"
    port = 5432
    dbname = "postgres"

    try:
        conn = psycopg2.connect(
            host=host, 
            user=user, 
            password=password, 
            port=port, 
            database=dbname
        )
        cur = conn.cursor()
        
        # 1. Products
        cur.execute("""
        CREATE TABLE IF NOT EXISTS insurance_products (
            id SERIAL PRIMARY KEY,
            company_name VARCHAR(100),
            product_name VARCHAR(255) UNIQUE,
            category VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        # 2. Rates (JSONB)
        cur.execute("""
        CREATE TABLE IF NOT EXISTS insurance_rates (
            id SERIAL PRIMARY KEY,
            product_name VARCHAR(255) UNIQUE,
            rates JSONB,
            coverages JSONB,
            extras JSONB,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("  [+] 테이블(Schema) 생성 성공!")
        return True
    except Exception as e:
        print(f"  [!] Direct 접속 실패: {e}")
        return False

if __name__ == "__main__":
    create_schema_direct()
