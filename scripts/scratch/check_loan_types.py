# -*- coding: utf-8 -*-
import os
import sys
from supabase import create_client

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
    res = supabase.table("credit_insurance_plans").select("loan_type").execute()
    
    counts = {}
    for row in res.data:
        lt = row['loan_type']
        counts[lt] = counts.get(lt, 0) + 1
        
    print("Database counts by loan_type:")
    for lt, count in counts.items():
        print(f"Loan Type: '{lt}' | Count: {count}")

if __name__ == "__main__":
    test_db()
