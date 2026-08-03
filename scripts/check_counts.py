import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_counts():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # 1. 보험 상품 개수 확인
        print("=== Database Status by Company ===")
        cur.execute("""
            SELECT company_name, COUNT(*) 
            FROM public.insurance_products 
            GROUP BY company_name
            ORDER BY COUNT(*) DESC
        """)
        companies = cur.fetchall()
        for corp, cnt in companies:
            print(f"- {corp:20}: {cnt} products")

        print("\n=== Rate Data Status by Company ===")
        cur.execute("""
            SELECT p.company_name, COUNT(r.id)
            FROM public.insurance_products p
            LEFT JOIN public.insurance_rates r ON p.product_code = r.product_code
            GROUP BY p.company_name
            ORDER BY COUNT(r.id) DESC
        """)
        rates = cur.fetchall()
        for corp, cnt in rates:
            print(f"- {corp:20}: {cnt} rates")

        conn.close()
    except Exception as e:
        print(f"[-] Database error: {e}")

if __name__ == "__main__":
    check_counts()
