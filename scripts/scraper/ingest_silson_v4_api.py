import csv
import json
import os
from dotenv import load_dotenv
from supabase import create_client

# 1. Env Setup
load_dotenv('.env')
load_dotenv('.env.local')

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CSV_PATH = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data.csv"

def clean_num(val):
    if not val: return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        import re
        m = re.search(r'\d+', s)
        return int(m.group()) if m else 0
    except:
        return 0

def run_ingest_api():
    print(f"[*] Starting SILSON ingestion (API Mode) from CSV: {CSV_PATH}")
    
    # 2. Read CSV and group by Product
    products = {}
    with open(CSV_PATH, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 9: continue
            comp = row[0].strip()
            prod = row[1].strip()
            m_prem = clean_num(row[7])
            f_prem = clean_num(row[8])
            if not comp or not prod: continue
            key = (comp, prod)
            if key not in products:
                products[key] = {
                    'company_name': comp,
                    'product_name': prod,
                    'category': '실속_의료실비',
                    'm_total': 0,
                    'f_total': 0,
                    'coverages': []
                }
            products[key]['m_total'] += m_prem
            products[key]['f_total'] += f_prem
            products[key]['coverages'].append({
                'name': row[3],
                'desc': row[4],
                'amount': row[6]
            })

    print(f"[*] Processed {len(products)} products.")

    # 3. API Operations
    try:
        # Delete old Silson data
        print("[*] Deleting old Silson records...")
        res = supabase.table('insurance_products').select('product_name').eq('category', '실속_의료실비').execute()
        old_prod_names = [r['product_name'] for r in res.data]
        
        if old_prod_names:
            supabase.table('insurance_rates').delete().in_('product_name', old_prod_names).execute()
            supabase.table('insurance_products').delete().eq('category', '실속_의료실비').execute()
        
        # Insert new data
        prod_inserts = []
        rate_inserts = []
        
        for key, p in products.items():
            if p['m_total'] < 100 and p['f_total'] < 100: continue
            
            prod_inserts.append({
                'company_name': p['company_name'],
                'product_name': p['product_name'],
                'category': p['category']
            })
            
            rate_inserts.append({
                'product_name': p['product_name'],
                'rates': {
                    "M": { "premium": p['m_total'] },
                    "F": { "premium": p['f_total'] },
                    "benchmark_age": 40
                },
                'coverages': p['coverages'],
                'extras': {}
            })
        
        if prod_inserts:
            supabase.table('insurance_products').insert(prod_inserts).execute()
            print(f"[*] Inserted {len(prod_inserts)} products.")
        
        if rate_inserts:
            for i in range(0, len(rate_inserts), 100):
                supabase.table('insurance_rates').insert(rate_inserts[i:i+100]).execute()
            print(f"[*] Inserted {len(rate_inserts)} rates.")
            
        print("[*] RELOAD COMPLETE.")
        
    except Exception as e:
        print(f"[!] API Error: {e}")

if __name__ == "__main__":
    run_ingest_api()
