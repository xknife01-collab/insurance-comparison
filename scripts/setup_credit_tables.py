# -*- coding: utf-8 -*-
import os
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"

def clean_and_parse_premium(val_str):
    if pd.isna(val_str) or not val_str:
        return 0
    val_str = str(val_str).replace(",", "").replace("원", "").replace(" ", "").strip()
    digits = "".join(c for c in val_str if c.isdigit())
    if digits:
        return int(digits)
    return 0

def setup_and_seed():
    print("[*] Connecting to Supabase using direct host db.wfkxwztxpugakusynhpx.supabase.co...")
    try:
        conn = psycopg2.connect(
            host="db.wfkxwztxpugakusynhpx.supabase.co",
            port=5432,
            database="postgres",
            user="postgres",
            password="rlaghddlf0411*"
        )
        cur = conn.cursor()
        print("[+] Direct connection established successfully!")
    except Exception as e:
        print(f"[-] Direct host connection failed: {e}")
        print("[*] Trying pooler host with postgresql URL...")
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            print("[-] DATABASE_URL env not found. Aborting.")
            return
        try:
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            print("[+] Connection established using DATABASE_URL!")
        except Exception as ex:
            print(f"[-] Connection via DATABASE_URL failed: {ex}")
            return

    # 1. Create table
    print("[*] Creating public.credit_insurance_plans table...")
    cur.execute("""
    CREATE TABLE IF NOT EXISTS public.credit_insurance_plans (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        loan_type VARCHAR(50) NOT NULL,        -- 'mortgage', 'jeonse', 'credit', 'business'
        loan_type_desc VARCHAR(255) NOT NULL,   -- '담보 주택 경매 방지', etc.
        coverage_type VARCHAR(100) NOT NULL,    -- '종합안심형', '사망단독형'
        premium_male_40 INTEGER NOT NULL,
        premium_female_40 INTEGER NOT NULL,
        payment_cycle VARCHAR(50) NOT NULL,     -- '월납', '일시납'
        details TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    """)
    
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_credit_plans_lookup 
    ON public.credit_insurance_plans (loan_type, coverage_type);
    """)
    conn.commit()
    print("[+] Table schema verified/created successfully.")

    # 2. Clear old data
    print("[*] Truncating table public.credit_insurance_plans...")
    cur.execute("TRUNCATE TABLE public.credit_insurance_plans RESTART IDENTITY CASCADE;")
    conn.commit()

    # 3. Read and filter CSV data
    df = pd.read_csv(CSV_PATH)
    products = df["상품명"].unique()

    inserted_count = 0

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
        plans_to_insert = [
            {
                "coverage_type": "사망단독형",
                "m_prem": main_m,
                "f_prem": main_f,
                "details_text": f"사망 또는 고도장해 단독 실속 보장형 플랜. (기준료: {main_m:,}원)"
            }
        ]

        if rider_m > 0 or rider_f > 0:
            plans_to_insert.append({
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
            for p in plans_to_insert:
                cur.execute("""
                INSERT INTO public.credit_insurance_plans (
                    company_name, product_name, loan_type, loan_type_desc, 
                    coverage_type, premium_male_40, premium_female_40, payment_cycle, details
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """, (co, prod, loan_type, loan_desc, p["coverage_type"], p["m_prem"], p["f_prem"], cycle, p["details_text"]))
                inserted_count += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"\n[+] Seeding complete. Successfully inserted {inserted_count} plan variations to Supabase.")

if __name__ == "__main__":
    setup_and_seed()
