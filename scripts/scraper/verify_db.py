# -*- coding: utf-8 -*-
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), "../../.env.local"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def check_counts():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 총 상품 수
    products = supabase.table("insurance_products").select("id", count="exact").execute()
    total_products = products.count
    
    # 카테고리별 통계
    categories = supabase.table("insurance_products").select("category").execute()
    stats = {}
    for row in categories.data:
        cat = row['category']
        stats[cat] = stats.get(cat, 0) + 1
        
    print(f"--- DB Verification Report ---")
    print(f"Total Products in DB: {total_products}")
    print("\n[Category Stats]")
    for cat, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {cat}: {count}")

if __name__ == "__main__":
    check_counts()
