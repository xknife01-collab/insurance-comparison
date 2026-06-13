import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

def run():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT id, company_name, product_name, care_type, premium_male_40, premium_female_40, is_increasing FROM public.caregiving_insurance_plans;")
    colnames = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    
    print(f"Total rows: {len(rows)}")
    for r in rows:
        print(dict(zip(colnames, r)))
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    run()
