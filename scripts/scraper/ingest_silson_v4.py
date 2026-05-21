import csv
import psycopg2
import json
import os
import urllib.parse
from dotenv import load_dotenv

# 1. Env Setup
load_dotenv('.env')
load_dotenv('.env.local')

DB_URL_RAW = os.getenv("DATABASE_URL")
try:
    prefix, rest = DB_URL_RAW.split("://", 1)
    user_pass, host_db = rest.split("@", 1)
    user, password = user_pass.split(":", 1)
    encoded_password = urllib.parse.quote(password)
    DB_URL = f"{prefix}://{user}:{encoded_password}@{host_db}"
except:
    DB_URL = DB_URL_RAW

CSV_PATH = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data.csv"

def clean_num(val):
    if not val: return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    # Handle cases like "24,963" or "24963"
    try:
        import re
        m = re.search(r'\d+', s)
        return int(m.group()) if m else 0
    except:
        return 0

def run_ingest():
    print(f"[*] Starting SILSON ingestion from CSV: {CSV_PATH}")
    
    # 2. Read CSV and group by Product
    products = {} # key: (company, product_name) -> { 'm_total': 0, 'f_total': 0, 'coverages': [] }
    
    with open(CSV_PATH, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        for row in reader:
            if len(row) < 9: continue
            
            comp = row[0].strip()
            prod = row[1].strip()
            category = row[2].strip()
            rider = row[3].strip()
            m_prem = clean_num(row[7])
            f_prem = clean_num(row[8])
            
            if not comp or not prod: continue
            
            key = (comp, prod)
            if key not in products:
                products[key] = {
                    'company': comp,
                    'product_name': prod,
                    'category': '실속_의료실비',
                    'm_total': 0,
                    'f_total': 0,
                    'coverages': []
                }
            
            products[key]['m_total'] += m_prem
            products[key]['f_total'] += f_prem
            products[key]['coverages'].append({
                'name': rider,
                'desc': row[4], # 지급사항
                'amount': row[6] # 가입금액
            })

    print(f"[*] Processed {len(products)} unique products from CSV.")

    # 3. DB Operations
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Delete old Silson data
        print("[*] Deleting old Silson records (category='실속_의료실비')...")
        # First find products to delete
        cur.execute("SELECT product_name FROM insurance_products WHERE category = '실속_의료실비'")
        old_prods = [r[0] for r in cur.fetchall()]
        
        if old_prods:
            cur.execute("DELETE FROM insurance_rates WHERE product_name = ANY(%s)", (old_prods,))
            cur.execute("DELETE FROM insurance_products WHERE category = '실속_의료실비'")
        
        success_count = 0
        for key, p in products.items():
            # Only ingest if there's a significant premium
            if p['m_total'] < 100 and p['f_total'] < 100: continue
            
            # Products Insert
            cur.execute("""
                INSERT INTO insurance_products (company_name, product_name, category)
                VALUES (%s, %s, %s)
                ON CONFLICT (product_name) DO UPDATE SET category = EXCLUDED.category;
            """, (p['company'], p['product_name'], p['category']))
            
            # Rates Insert
            # We store the sums for 40 and 61 based on filename if we had it, 
            # but since we only have one CSV, let's assume it's for the age 40 (standard).
            # The CSV data seemed to be for a specific benchmark age.
            rates_json = {
                "M": { "premium": p['m_total'] },
                "F": { "premium": p['f_total'] },
                "benchmark_age": 40
            }
            
            cur.execute("""
                INSERT INTO insurance_rates (product_name, rates, coverages, extras)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (product_name) DO UPDATE SET 
                    rates = EXCLUDED.rates, 
                    coverages = EXCLUDED.coverages,
                    updated_at = CURRENT_TIMESTAMP;
            """, (p['product_name'], json.dumps(rates_json), json.dumps(p['coverages']), json.dumps({})))
            
            success_count += 1
            
        conn.commit()
        cur.close()
        conn.close()
        print(f"[*] Success! {success_count} Silson products reloaded into DB.")
        
    except Exception as e:
        print(f"[!] DB Error: {e}")

if __name__ == "__main__":
    run_ingest()
