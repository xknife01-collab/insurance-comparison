# -*- coding: utf-8 -*-
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), "../../.env.local"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def check_company_counts():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    products = supabase.table("insurance_products").select("company_name, category").execute()
    
    stats = {}
    for row in products.data:
        co = row['company_name']
        stats[co] = stats.get(co, 0) + 1
        
    print(f"--- Company Ingestion Stats ---")
    for co, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {co}: {count} products")

if __name__ == "__main__":
    check_company_counts()
