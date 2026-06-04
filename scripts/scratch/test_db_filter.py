# -*- coding: utf-8 -*-
import os
from supabase import create_client

def test_filter():
    # Read environment variables
    env_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
    url = ""
    key = ""
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "VITE_SUPABASE_URL" in line:
                url = line.split("=")[1].strip().strip('"').strip("'")
            if "SUPABASE_SERVICE_ROLE_KEY" in line:
                key = line.split("=")[1].strip().strip('"').strip("'")
                
    supabase = create_client(url, key)
    
    print("=== All mortgage plans ===")
    res = supabase.table("credit_insurance_plans").select("*").eq("loan_type", "mortgage").execute()
    data = res.data
    for p in data:
        print(f"Company: {p['company_name']} | Product: {p['product_name']} | Cover: {p['coverage_type']} | M40: {p['premium_male_40']}")

    print("\n=== filtered for 대출안심형 ===")
    relief = [p for p in data if "정기보험" not in p["product_name"]]
    for p in relief:
         print(f"Product: {p['product_name']} | Premium: {p['premium_male_40']}")

    print("\n=== filtered for 정기보장형 ===")
    term = [p for p in data if "정기보험" in p["product_name"]]
    for p in term:
         print(f"Product: {p['product_name']} | Premium: {p['premium_male_40']}")

if __name__ == "__main__":
    test_filter()
