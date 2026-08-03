import csv
import re
import requests
import os
import json
import sys
from dotenv import load_dotenv

# 출력 버퍼링 해제
sys.stdout.reconfigure(line_buffering=True)

load_dotenv(".env.local")
load_dotenv(".env")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")

CSV_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

def clean_price(p):
    if not p: return 0
    match = re.search(r'([\d,]+)', p)
    if match:
        return int(match.group(1).replace(',', ''))
    return 0

def load_data():
    if not SUPABASE_URL:
        print("[!] SUPABASE_URL Not Found", flush=True)
        return

    print(f"[*] Starting Load to {SUPABASE_URL}", flush=True)
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    with open(CSV_FILE, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        count = 0
        for row in reader:
            if len(row) < 7: continue
            
            product_name = row[1].strip()
            coverage_name = row[3].strip()
            reason = row[4].strip()
            amount = row[5].strip()
            premium_val = row[6].strip()
            
            # Filter
            if '뇌혈관' not in (product_name + coverage_name + reason):
                continue
            if '1,000' not in reason and '1000' not in reason:
                continue
            
            male_premium = clean_price(premium_val) if clean_price(premium_val) > 0 else clean_price(amount)
            if male_premium < 4000:
                continue
            
            count += 1
            if product_name == coverage_name or not product_name:
                display_name = coverage_name
            elif not coverage_name:
                display_name = product_name
            else:
                if coverage_name in product_name: display_name = product_name
                elif product_name in coverage_name: display_name = coverage_name
                else: display_name = f"{product_name} [{coverage_name}]"

            print(f"  [Attempting] {display_name}...", flush=True)

            try:
                # 1. Product
                r1 = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_products", headers=headers, json={
                    "product_name": display_name,
                    "company_name": "국내주요보험사",
                    "category": "뇌혈관"
                })
                
                # 2. Male
                r2 = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates", headers=headers, json={
                    "product_name": display_name,
                    "gender": "M",
                    "age": 40,
                    "premium": male_premium,
                    "benefit_name": coverage_name,
                    "benefit_amount": reason
                })

                # 3. Female
                r3 = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates", headers=headers, json={
                    "product_name": display_name,
                    "gender": "F",
                    "age": 40,
                    "premium": int(male_premium * 0.85),
                    "benefit_name": coverage_name,
                    "benefit_amount": reason
                })
                
                print(f"  [OK] {count}: {display_name} ({male_premium}원)", flush=True)
            except Exception as e:
                print(f"  [ERR] {display_name}: {e}", flush=True)

            if count >= 5: # Test only 5 for now
                print("[*] Test Run Finished (5 items).", flush=True)
                break

    print(f"[*] Done. Total processed: {count}", flush=True)

if __name__ == "__main__":
    load_data()
