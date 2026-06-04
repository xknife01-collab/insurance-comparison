# -*- coding: utf-8 -*-
import os
import pandas as pd
import json
from supabase import create_client
from dotenv import load_dotenv

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.csv"

def upload_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    print(f"[*] Connecting to Supabase HTTP API: {url}...")
    try:
        supabase = create_client(url, key)
    except Exception as e:
        print(f"[-] Failed to create Supabase client: {e}")
        return
        
    if not os.path.exists(CSV_PATH):
        print(f"[-] CSV file not found at {CSV_PATH}")
        return
        
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    
    # Filter rows where at least one of the premium columns is not empty
    df = df[
        (df["기준보험료"].notna() & (df["기준보험료"].astype(str).str.strip() != "")) |
        (df["가입보험료"].notna() & (df["가입보험료"].astype(str).str.strip() != ""))
    ]
    
    print(f"[+] Loaded CSV with {len(df)} rows after filtering for valid premiums.")
    
    # 1. Extract and upload unique products
    unique_products_df = df[["보험회사", "상품명"]].drop_duplicates()
    products_list = []
    for idx, row in unique_products_df.iterrows():
        products_list.append({
            "company_name": str(row["보험회사"]),
            "product_name": str(row["상품명"]),
            "category": "법률비용"
        })
        
    print(f"[*] Clearing existing products from legal_insurance_products...")
    try:
        supabase.table("legal_insurance_products").delete().neq("company_name", "DELETE_NONE").execute()
        print("[+] Table legal_insurance_products cleared.")
    except Exception as e:
        print(f"[-] Error clearing legal_insurance_products: {e}")
        return
        
    if products_list:
        try:
            supabase.table("legal_insurance_products").insert(products_list).execute()
            print(f"[+] Successfully uploaded {len(products_list)} products.")
        except Exception as e:
            print(f"[-] Failed to upload products: {e}")
            return
            
    # 2. Extract and upload rates
    rates_list = []
    for idx, row in df.iterrows():
        # Construct raw_data json
        raw_dict = {}
        for col_idx in range(30):
            col_name = f"원본_열_{col_idx}"
            raw_dict[col_name] = row[col_name] if pd.notna(row[col_name]) else ""
            
        rates_list.append({
            "product_name": str(row["상품명"]),
            "rider_type": str(row["구분"]) if pd.notna(row["구분"]) else "",
            "coverage_name": str(row["담보명(급부명)"]),
            "payout_reason": str(row["지급사유"]) if pd.notna(row["지급사유"]) else "",
            "payout_amount": str(row["지급금액"]) if pd.notna(row["지급금액"]) else "",
            "male_premium": str(row["기준보험료"]) if pd.notna(row["기준보험료"]) else "",
            "female_premium": str(row["가입보험료"]) if pd.notna(row["가입보험료"]) else "",
            "is_renewable": str(row["갱신구분"]) if pd.notna(row["갱신구분"]) else "",
            "source_file": str(row["source_file"]),
            "raw_data": raw_dict
        })
        
    print(f"[*] Clearing existing rates from legal_insurance_rates...")
    try:
        supabase.table("legal_insurance_rates").delete().neq("coverage_name", "DELETE_NONE").execute()
        print("[+] Table legal_insurance_rates cleared.")
    except Exception as e:
        print(f"[-] Error clearing legal_insurance_rates: {e}")
        return
        
    if rates_list:
        try:
            supabase.table("legal_insurance_rates").insert(rates_list).execute()
            print(f"[+] Successfully uploaded {len(rates_list)} rates.")
        except Exception as e:
            print(f"[-] Failed to upload rates: {e}")
            return
            
    print("[+] SUCCESS! All legal insurance data successfully uploaded to Supabase.")

if __name__ == "__main__":
    upload_data()
