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

CLEAN_CSV_PATH = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\silson\extracted_data_clean.csv"

def clean_num(val):
    if not val: return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        m = re.search(r'\d+', s)
        return int(m.group()) if m else 0
    except:
        return 0

def run_ingest_v6():
    print(f"[*] Starting SILSON ingestion (v6 API) from CLEAN CSV: {CLEAN_CSV_PATH}")
    
    products = {}
    with open(CLEAN_CSV_PATH, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 8: continue
            
            comp = row[0].strip()
            prod = row[1].strip()
            # CORRECT COLUMN MAPPING:
            # Col 6: Male, Col 7: Female
            m_prem = clean_num(row[6])
            f_prem = clean_num(row[7])
            
            if not comp or not prod: continue
            
            # Identify if it's "Old Age" (노후)
            category = '실속_의료실비'
            if '노후' in prod or '노후' in row[2] or '노후' in row[3]:
                category = '노후_의료실비'
            
            # Simple normalization for product code
            prod_code = f"{comp}_{prod}"[:48]
            prod_code = re.sub(r'[^a-zA-Z0-9가-힣\_]', '_', prod_code)
            
            if prod_code not in products:
                products[prod_code] = {
                    'product_code': prod_code,
                    'company_name': comp,
                    'display_name': prod,
                    'category': category,
                    'm_total': 0,
                    'f_total': 0,
                    'coverages': []
                }
            
            products[prod_code]['m_total'] += m_prem
            products[prod_code]['f_total'] += f_prem
            products[prod_code]['coverages'].append({
                'name': row[3],
                'desc': row[4],
                'amount': row[5], # 가입금액/지급금액
                'm_prem': m_prem,
                'f_prem': f_prem
            })

    print(f"[*] Grouped into {len(products)} products.")

    # 3. API Operations
    try:
        print("[*] Deleting ALL existing Silson records...")
        supabase.table('medical_silson_rates').delete().neq('product_code', 'NONE').execute()
        supabase.table('medical_silson_products').delete().neq('product_code', 'NONE').execute()
        
        prod_inserts = []
        rate_inserts = []
        
        for code, p in products.items():
            if p['m_total'] < 100 and p['f_total'] < 100: continue
            
            prod_inserts.append({
                'product_code': p['product_code'],
                'company_name': p['company_name'],
                'display_name': p['display_name'],
                'category': p['category']
            })
            
            # Male Rate
            rate_inserts.append({
                'product_code': p['product_code'],
                'gender': 'M',
                'age': 40,
                'rate_data': { 'premium': p['m_total'], 'coverages': p['coverages'] }
            })
            # Female Rate
            rate_inserts.append({
                'product_code': p['product_code'],
                'gender': 'F',
                'age': 40,
                'rate_data': { 'premium': p['f_total'], 'coverages': p['coverages'] }
            })
        
        if prod_inserts:
            for i in range(0, len(prod_inserts), 100):
                supabase.table('medical_silson_products').insert(prod_inserts[i:i+100]).execute()
            print(f"[*] Inserted {len(prod_inserts)} products.")
        
        if rate_inserts:
            for i in range(0, len(rate_inserts), 100):
                supabase.table('medical_silson_rates').insert(rate_inserts[i:i+100]).execute()
            print(f"[*] Inserted {len(rate_inserts)} rates.")
            
        print("[*] SILSON V6 RELOAD COMPLETE.")
        
    except Exception as e:
        print(f"[!] API Error: {e}")

if __name__ == "__main__":
    run_ingest_v6()
