# -*- coding: utf-8 -*-
import pandas as pd
import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Ensure stdout handles Korean encoding properly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\health_general\extracted_data.csv"

def upload_data():
    print("==================== Uploading Comprehensive Health Insurance to Supabase ====================")
    
    # 1. Load env variables
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files!")
        return
        
    print(f"[+] Connecting to Supabase at: {url}")
    supabase = create_client(url, key)
    
    # 2. Load CSV
    if not os.path.exists(CSV_PATH):
        print(f"[-] File not found: {CSV_PATH}")
        return
        
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    df = df.fillna("")
    print(f"[+] Loaded CSV successfully: {len(df)} rows")
    
    # 3. Extract and upload unique products
    print("[*] Extracting unique products...")
    unique_prods = df[["보험회사", "상품명"]].drop_duplicates()
    products_to_insert = []
    seen = set()
    for _, r in unique_prods.iterrows():
        comp = str(r["보험회사"]).strip()
        prod = str(r["상품명"]).strip()
        if comp and prod and prod not in seen:
            products_to_insert.append({
                "company_name": comp,
                "product_name": prod
            })
            seen.add(prod)
            
    print(f"[+] Found {len(products_to_insert)} unique products.")
    
    # Clear and upload unique products
    try:
        print("[*] Clearing health_general_products table...")
        supabase.table('health_general_products').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Cleared health_general_products table.")
    except Exception as e:
        print(f"[-] Failed to clear health_general_products: {e}")
        
    try:
        print(f"[*] Uploading {len(products_to_insert)} products...")
        supabase.table('health_general_products').insert(products_to_insert).execute()
        print("[+] Uploaded unique products successfully.")
    except Exception as e:
        print(f"[-] Failed to upload products: {e}")
        return
        
    # 4. Clear and upload rates in batches
    try:
        print("[*] Clearing health_general_rates table...")
        supabase.table('health_general_rates').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Cleared health_general_rates table.")
    except Exception as e:
        print(f"[-] Failed to clear health_general_rates: {e}")
        
    # Prepare rates rows
    rates_to_insert = []
    
    def tr(val, max_len=95):
        s = str(val).strip()
        if len(s) > max_len:
            return s[:max_len]
        return s
        
    for idx, row in df.iterrows():
        row_dict = {
            "product_name": tr(row["상품명"], 250),
            "company_name": tr(row["보험회사"], 95),
            "division": tr(row["구분"], 95),
            "coverage_name": tr(row["담보명(급부명)"], 250),
            "payout_reason": str(row["지급사유"]),
            "payout_amount": tr(row["지급금액"], 95),
            "insured_amount": tr(row["가입금액"], 95),
            "male_premium": tr(row["기준보험료"], 95),
            "female_premium": tr(row["가입보험료"], 95),
            "applied_interest_rate": tr(row["적용이율"], 95),
            "renewal_type": tr(row["갱신구분"], 45),
            "sales_channel": tr(row["판매채널"], 95),
            "base_date": tr(row["기준일자"], 45),
            "detail_desc": str(row["상세안내"]),
            "contact_number": tr(row["연락처"], 95),
            "source_file": tr(row["source_file"], 250)
        }
        
        # Add the 30 raw cols
        for i in range(30):
            row_dict[f"raw_col_{i}"] = str(row[f"원본_열_{i}"])
            
        rates_to_insert.append(row_dict)
        
    # Insert in batches of 500
    batch_size = 500
    total_inserted = 0
    print(f"[*] Starting upload of {len(rates_to_insert)} rates rows in batches of {batch_size}...")
    
    for i in range(0, len(rates_to_insert), batch_size):
        batch = rates_to_insert[i:i+batch_size]
        try:
            supabase.table('health_general_rates').insert(batch).execute()
            total_inserted += len(batch)
            print(f"[+] Uploaded {total_inserted}/{len(rates_to_insert)} rows...")
        except Exception as e:
            print(f"[-] Batch upload failed at row index {i}: {e}")
            sys.exit(1)
            
    print(f"\n[SUCCESS] Successfully uploaded all {total_inserted} records to Supabase!")

if __name__ == "__main__":
    upload_data()
