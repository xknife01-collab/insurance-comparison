# -*- coding: utf-8 -*-
import os
from supabase import create_client
from dotenv import load_dotenv

def verify():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    supabase = create_client(url, key)
    
    prod_resp = supabase.table("legal_insurance_products").select("*", count="exact").execute()
    rates_resp = supabase.table("legal_insurance_rates").select("*", count="exact").execute()
    
    print("--- Supabase Verification ---")
    print(f"Products count: {prod_resp.count}")
    print(f"Rates count: {rates_resp.count}")
    
    print("\nProducts list:")
    for p in prod_resp.data:
        print(f"  - [{p['company_name']}] {p['product_name']}")
        
    print("\nRates sample (first 3):")
    for r in rates_resp.data[:3]:
        print(f"  - {r['product_name']} | {r['coverage_name']} | Male: {r['male_premium']} | Female: {r['female_premium']}")

if __name__ == "__main__":
    verify()
