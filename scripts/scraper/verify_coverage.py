# -*- coding: utf-8 -*-
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.getcwd(), "../../.env.local"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def verify_16_categories():
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 카테고리별 상품 수 조회
    res = supabase.table("insurance_products").select("category").execute()
    counts = {}
    for row in res.data:
        cat = row['category']
        counts[cat] = counts.get(cat, 0) + 1
        
    target_16 = [
        "cancer", "surgery", "life", "pension", "driver", "child", 
        "pre-existing", "medical", "term", "home", "dementia", 
        "baby", "variable", "auto", "brain", "heart"
    ]
    
    print("--- 16 Categories Coverage Report ---")
    for cat in target_16:
        count = counts.get(cat, 0)
        status = "[FOUND]" if count > 0 else "[MISSING]"
        print(f"  {status} {cat}: {count} products")

if __name__ == "__main__":
    verify_16_categories()
