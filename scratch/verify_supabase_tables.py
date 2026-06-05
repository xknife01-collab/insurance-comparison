import psycopg2
import sys

DB_HOST = "db.wfkxwztxpugakusynhpx.supabase.co"
DB_USER = "postgres"
DB_PASSWORD = "rlaghddlf0411*"
DB_PORT = 5432
DB_NAME = "postgres"

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        database=DB_NAME
    )
    cur = conn.cursor()
    
    # 1. Check products count
    cur.execute("SELECT COUNT(*) FROM golf_insurance_products;")
    prod_count = cur.fetchone()[0]
    
    # 2. Check rates count
    cur.execute("SELECT COUNT(*) FROM golf_insurance_rates;")
    rates_count = cur.fetchone()[0]
    
    # 3. Fetch rates sample
    cur.execute("SELECT product_name, plan_level, gender, age, premium FROM golf_insurance_rates;")
    rows = cur.fetchall()
    
    print("SUCCESS")
    print(f"Products Count: {prod_count}")
    print(f"Rates Count: {rates_count}")
    print("\nRates Sample:")
    for r in rows:
        print(f"  - {r[0]} | {r[1]} | {r[2]} | {r[3]}세 | {r[4]:,}원")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
