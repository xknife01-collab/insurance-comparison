# -*- coding: utf-8 -*-
import os
import pandas as pd
from supabase import create_client
from dotenv import load_dotenv

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"

def clean_and_parse_premium(val_str):
    if pd.isna(val_str) or not val_str:
        return 0
    val_str = str(val_str).replace(",", "").replace("원", "").replace(" ", "").strip()
    digits = "".join(c for c in val_str if c.isdigit())
    if digits:
        return int(digits)
    return 0

def upload_credit_data():
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
        
    df = pd.read_csv(CSV_PATH)
    products = df["상품명"].unique()
    print(f"[+] Loaded CSV with {len(df)} rows. Unique products: {len(products)}")
    
    plans_to_insert = []
    
    for prod in sorted(products):
        prod_df = df[df["상품명"] == prod]
        co = prod_df.iloc[0]["보험회사"]
        desc = str(prod_df.iloc[0]["상세안내"])
        
        cycle = "월납"
        if "일시납" in desc or "하나생명" in co:
            cycle = "일시납"

        # Separate main and riders
        main_df = prod_df[prod_df["구분"] == "주계약"].drop_duplicates(subset=["담보명(급부명)"])
        rider_df = prod_df[prod_df["구분"] == "특약"].drop_duplicates(subset=["담보명(급부명)"])

        main_m = clean_and_parse_premium(main_df.iloc[0]["기준보험료"]) if len(main_df) > 0 else 0
        main_f = clean_and_parse_premium(main_df.iloc[0]["가입보험료"]) if len(main_df) > 0 else 0
        
        rider_m = sum(clean_and_parse_premium(r["기준보험료"]) for _, r in rider_df.iterrows())
        rider_f = sum(clean_and_parse_premium(r["가입보험료"]) for _, r in rider_df.iterrows())

        # Total combined premiums
        total_m = main_m + rider_m
        total_f = main_f + rider_f

        # Exclude if combined premium for BOTH male and female is under 20,000 KRW
        if total_m < 20000 and total_f < 20000:
            print(f"[-] Excluding {prod} (Male: {total_m:,}원, Female: {total_f:,}원) - Under 20k KRW")
            continue

        # Prepare plans
        plans = [
            {
                "coverage_type": "사망단독형",
                "m_prem": main_m,
                "f_prem": main_f,
                "details_text": f"사망 또는 고도장해 단독 실속 보장형 플랜. (기준료: {main_m:,}원)"
            }
        ]

        if rider_m > 0 or rider_f > 0:
            plans.append({
                "coverage_type": "종합안심형",
                "m_prem": total_m,
                "f_prem": total_f,
                "details_text": f"3대 질병 진단비 및 수술비 보장 특약이 합산된 종합안심형 플랜. (기준료: {total_m:,}원)"
            })

        # Map to loan types (mortgage, jeonse, credit, business)
        loan_mapping = []
        if "담보대출" in prod or "1종" in prod:
            loan_mapping = [("mortgage", "담보 주택 경매 방지")]
        elif "신용대출" in prod or "2종" in prod:
            loan_mapping = [("credit", "고이율 채무 연체 예방")]
        else:
            loan_mapping = [
                ("mortgage", "담보 주택 경매 방지"),
                ("jeonse", "전세 자산 보존"),
                ("credit", "고이율 채무 연체 예방"),
                ("business", "사업 채무 부실 방지")
            ]

        for loan_type, loan_desc in loan_mapping:
            for p in plans:
                plans_to_insert.append({
                    "company_name": co,
                    "product_name": prod,
                    "loan_type": loan_type,
                    "loan_type_desc": loan_desc,
                    "coverage_type": p["coverage_type"],
                    "premium_male_40": p["m_prem"],
                    "premium_female_40": p["f_prem"],
                    "payment_cycle": cycle,
                    "details": p["details_text"]
                })
                
    print(f"[*] Clearing existing records from public.credit_insurance_plans...")
    try:
        supabase.table("credit_insurance_plans").delete().neq("company_name", "DELETE_NONE").execute()
        print("[+] Table credit_insurance_plans cleared.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if plans_to_insert:
        print(f"[*] Uploading {len(plans_to_insert)} records in batches of 100...")
        batch_size = 100
        for i in range(0, len(plans_to_insert), batch_size):
            batch = plans_to_insert[i:i+batch_size]
            try:
                supabase.table("credit_insurance_plans").insert(batch).execute()
                print(f"  [+] Uploaded batch {i // batch_size + 1} ({len(batch)} records)")
            except Exception as e:
                print(f"  [-] Failed to upload batch {i // batch_size + 1}: {e}")
                return
        print("[+] SUCCESS! All credit insurance plans successfully uploaded to Supabase.")

if __name__ == "__main__":
    upload_credit_data()
