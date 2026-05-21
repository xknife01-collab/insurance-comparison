import csv
import json
import os
import re
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
        m = re.search(r'\d+', s)
        return int(m.group()) if m else 0
    except:
        return 0

def run_ingest_v5():
    print(f"[*] Starting SILSON ingestion (v5 API) from CSV: {CSV_PATH}")
    
    # 2. Read CSV and group by Product
    # The organized CSV has 46 columns.
    # col 0: 보험사, col 1: 상품명, col 7: 남보험료, col 8: 여보험료
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
            
            # Use same product_code logic as previous scripts
            prod_code = f"{comp}_{prod}".substring(0, 48) if hasattr("", "substring") else f"{comp}_{prod}"[:48]
            prod_code = re.sub(r'[^a-zA-Z0-9가-힣\_]', '_', prod_code)
            
            if prod_code not in products:
                products[prod_code] = {
                    'product_code': prod_code,
                    'company_name': comp,
                    'display_name': prod,
                    'm_total': 0,
                    'f_total': 0
                }
            products[prod_code]['m_total'] += m_prem
            products[prod_code]['f_total'] += f_prem

    print(f"[*] Processed {len(products)} products from CSV.")

    # 3. API Operations
    try:
        # Delete old Silson data
        print("[*] Deleting ALL existing Silson records from medical_silson_rates and products...")
        # Since these are specialized tables, we can clear them completely as requested
        supabase.table('medical_silson_rates').delete().neq('product_code', 'NONE').execute()
        supabase.table('medical_silson_products').delete().neq('product_code', 'NONE').execute()
        
        # Prepare inserts
        prod_inserts = []
        rate_inserts = []
        
        for code, p in products.items():
            # Only ingest if there's a significant premium
            if p['m_total'] < 100 and p['f_total'] < 100: continue
            
            prod_inserts.append({
                'product_code': p['product_code'],
                'company_name': p['company_name'],
                'display_name': p['display_name']
            })
            
            # Male Rate
            rate_inserts.append({
                'product_code': p['product_code'],
                'gender': 'M',
                'age': 40, # Default benchmark age
                'rate_data': { 'premium': p['m_total'] }
            })
            # Female Rate
            rate_inserts.append({
                'product_code': p['product_code'],
                'gender': 'F',
                'age': 40, # Default benchmark age
                'rate_data': { 'premium': p['f_total'] }
            })
        
        if prod_inserts:
            # Upsert products
            for i in range(0, len(prod_inserts), 100):
                supabase.table('medical_silson_products').insert(prod_inserts[i:i+100]).execute()
            print(f"[*] Inserted {len(prod_inserts)} products.")
        
        if rate_inserts:
            # Upsert rates
            for i in range(0, len(rate_inserts), 100):
                supabase.table('medical_silson_rates').insert(rate_inserts[i:i+100]).execute()
            print(f"[*] Inserted {len(rate_inserts)} rates.")
            
        print("[*] SILSON RELOAD COMPLETE.")
        
    except Exception as e:
        print(f"[!] API Error: {e}")

if __name__ == "__main__":
    run_ingest_v5()
