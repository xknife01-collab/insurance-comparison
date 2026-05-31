# -*- coding: utf-8 -*-
import os
import re
import json
import pdfplumber
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. .env.local 로드 (API 방식 위해)
load_dotenv(os.path.join(os.getcwd(), "../../.env.local"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

CATEGORY_KEYWORDS = {
    "cancer": ["암보험", "암진단", "소액암"],
    "surgery": ["수술비", "입원비"],
    "life": ["종신", "사망"],
    "auto": ["자동차"],
    "brain": ["뇌출혈", "뇌혈관"],
    "heart": ["심장", "심근경색"]
}

def get_supabase():
    print(f"[*] Supabase API: {SUPABASE_URL}")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def categorize_product(text_sample, file_name):
    combined = (text_sample + file_name).lower()
    for cat_id, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            return cat_id
    return "unknown"

def run_ingestion():
    print("[*] Starting SMALL Batch Ingestion (Test Mode)...")
    try:
        supabase: Client = get_supabase()
    except Exception as e:
        print(f"[-] Supabase Init Error: {e}")
        return

    download_root = os.path.join(os.getcwd(), "..", "..", "downloads")
    
    count = 0
    for company_dir in os.listdir(download_root):
        if count >= 5: break
        
        company_path = os.path.join(download_root, company_dir)
        if not os.path.isdir(company_path): continue
        
        print(f"\n[>>>] Processing {company_dir}...")
        files = [f for f in os.listdir(company_path) if f.lower().endswith(".pdf")]
        
        for filename in files[:2]:
            if count >= 5: break
            print(f"  Saving: {filename}")
            
            clean_name = re.sub(r'[^\w\s-]', '', filename.replace(".pdf", ""))
            product_code = f"{company_dir.upper()}_{clean_name[:20].replace(' ', '_')}"
            
            try:
                supabase.table("insurance_products").upsert({
                    "product_code": product_code,
                    "company_name": company_dir,
                    "display_name": clean_name,
                    "category": "test",
                    "standard_code": "STD_AUTO"
                }).execute()
                print(f"    [✔] Success: {product_code}")
                count += 1
            except Exception as e:
                print(f"    [-] Error: {e}")

    print("\n[✔] TEST COMPLETE.")

if __name__ == "__main__":
    run_ingestion()
