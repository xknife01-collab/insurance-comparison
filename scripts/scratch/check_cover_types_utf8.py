# -*- coding: utf-8 -*-
import os
import sys
from supabase import create_client

# Force stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

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
    
    unique_types = set()
    for row in res.data:
        unique_types.add(row['coverage_type'])
        
    for t in unique_types:
        print(f"Coverage Type: '{t}' | UTF-8 Bytes: {t.encode('utf-8')}")

if __name__ == "__main__":
    test_db()
