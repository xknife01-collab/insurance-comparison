import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def main():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        # Check tables in database
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = [r[0] for r in cur.fetchall()]
        print(f"[*] Public tables: {tables}")

        if 'pension_products' in tables:
            cur.execute("SELECT COUNT(*) FROM public.pension_products")
            pension_cnt = cur.fetchone()[0]
            print(f"[*] Total rows in pension_products: {pension_cnt}")

            # Check unique product names
            cur.execute("SELECT DISTINCT product_name FROM public.pension_products LIMIT 20")
            products = [r[0] for r in cur.fetchall()]
            print(f"[*] Unique product names (sample 20): {products}")
            
            # Check products with '저축'
            cur.execute("SELECT COUNT(*), COUNT(DISTINCT product_name) FROM public.pension_products WHERE product_name LIKE '%저축%'")
            saving_cnt, saving_uniq = cur.fetchone()
            print(f"[*] Products with '저축' in product_name: {saving_cnt} rows, {saving_uniq} unique products")
            
            # Show a few savings products
            cur.execute("SELECT DISTINCT company, product_name FROM public.pension_products WHERE product_name LIKE '%저축%' LIMIT 10")
            saving_samples = cur.fetchall()
            print(f"[*] Savings product samples: {saving_samples}")

        conn.close()
    except Exception as e:
        print(f"[-] Database Error: {e}")

if __name__ == "__main__":
    main()
