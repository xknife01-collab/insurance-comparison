import os
import sys
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

env_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
supabase_url = None
supabase_key = None

if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                if key.strip() == "VITE_SUPABASE_URL":
                    supabase_url = val.strip().strip('"').strip("'")
                elif key.strip() == "VITE_SUPABASE_ANON_KEY":
                    supabase_key = val.strip().strip('"').strip("'")

if supabase_url and supabase_key:
    client = create_client(supabase_url, supabase_key)
    res = client.table("variable_products").select("*").execute()
    data = res.data
    
    print("--- BNP파리바카디프생명 products ---")
    cardiff = [x for x in data if "카디프" in x.get("company", "")]
    for p in cardiff:
        print(f"{p['product_name']} | sub_type: {p['sub_type']} | male: {p['male_premium_40']} | female: {p['female_premium_40']}")
        
    print("\n--- Products with '라이프UP' or '헤리티지' or 'e정기' ---")
    keywords = ["라이프UP", "헤리티지", "e정기"]
    matches = [x for x in data if any(k in x.get("product_name", "") for k in keywords)]
    for p in matches:
        print(f"{p['company']} | {p['product_name']} | sub_type: {p['sub_type']} | male: {p['male_premium_40']} | female: {p['female_premium_40']}")
else:
    print("Credentials not found")
