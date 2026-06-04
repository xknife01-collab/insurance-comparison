# -*- coding: utf-8 -*-
import os
from supabase import create_client

def test_db():
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
    res = supabase.table("credit_insurance_plans").select("product_name, coverage_type").execute()
    for row in res.data:
        print(f"Product: {row['product_name']} | Coverage Type: {repr(row['coverage_type'])}")

if __name__ == "__main__":
    test_db()
