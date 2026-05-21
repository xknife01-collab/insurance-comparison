import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_supabase():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # 1. 보험 상품 개수 확인
        cur.execute("SELECT COUNT(*) FROM public.insurance_products")
        prod_cnt = cur.fetchone()[0]
        print(f"[*] Total Products (Supabase): {prod_cnt}")

        # 2. 보험료 데이터 개수 확인
        cur.execute("SELECT COUNT(*) FROM public.insurance_rates")
        rate_cnt = cur.fetchone()[0]
        print(f"[*] Total Rate Entries (Supabase): {rate_cnt}")

        # 3. 삼성화재 데이터 확인
        cur.execute("""
            SELECT company_name, gender, age, rate_data 
            FROM public.insurance_rates r
            JOIN public.insurance_products p ON r.product_code = p.product_code
            WHERE p.company_name = '삼성화재'
            ORDER BY r.created_at DESC 
            LIMIT 5
        """)
        samples = cur.fetchall()
        print("\n[*] Latest Samsung Fire Samples:")
        for s in samples:
            print(f"- {s[0]}: {s[1]}, {s[2]}세, Data: {s[3]}")

        conn.close()
    except Exception as e:
        print(f"[-] Supabase Connection/Query Error: {e}")

if __name__ == "__main__":
    check_supabase()
