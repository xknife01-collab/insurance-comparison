import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def check_brain_data():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()

        print("\n[*] Checking brain_insurance_products:")
        cur.execute("SELECT product_name, company_name, category FROM public.brain_insurance_products")
        products = cur.fetchall()
        for p in products:
            print(f"- {p[0]} ({p[1]}): {p[2]}")

        print("\n[*] Checking brain_insurance_rates (Sample):")
        cur.execute("SELECT product_name, gender, premium, raw_data FROM public.brain_insurance_rates LIMIT 10")
        rates = cur.fetchall()
        for r in rates:
            print(f"- {r[0]}: {r[1]}, Premium: {r[2]}, Raw: {r[3]}")

        conn.close()
    except Exception as e:
        print(f"[-] Supabase Error: {e}")

if __name__ == "__main__":
    check_brain_data()
