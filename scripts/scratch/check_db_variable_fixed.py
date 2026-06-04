import os
import psycopg2

db_url = "postgresql://postgres.wfkxwztxpugakusynhpx:rlaghddlf0411*@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

try:
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    cur.execute("SELECT id, company, product_name, sub_type, male_premium_40, female_premium_40, declared_rate, business_fee FROM public.variable_products ORDER BY id;")
    rows = cur.fetchall()
    
    print(f"Total products in variable_products: {len(rows)}")
    for r in rows:
        print(f"ID: {r[0]} | Company: {r[1]} | Name: {r[2]} | SubType: {r[3]} | Male40: {r[4]} | Female40: {r[5]} | Rate: {r[6]} | Fee: {r[7]}")
        
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error checking DB: {e}")
