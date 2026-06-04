# -*- coding: utf-8 -*-
import os
import pandas as pd
import json
import psycopg2

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.csv"
def upload_data():
    if not os.path.exists(CSV_PATH):
        print(f"[-] CSV file not found at {CSV_PATH}")
        return
        
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    print(f"[+] Loaded CSV with {len(df)} rows.")
    
    # Connect to PostgreSQL
    print("[*] Connecting to Supabase database...")
    try:
        conn = psycopg2.connect(
            host="db.wfkxwztxpugakusynhpx.supabase.co",
            user="postgres",
            password="rlaghddlf0411*",
            port=5432,
            database="postgres"
        )
        cur = conn.cursor()
    except Exception as e:
        print(f"[-] Database connection failed: {e}")
        return
        
    # Extract unique products
    # Columns in public.legal_insurance_products:
    # id, company_name, product_name, category
    unique_products = df[["보험회사", "상품명"]].drop_duplicates()
    print(f"[*] Found {len(unique_products)} unique products to insert.")
    
    try:
        # 1. Clear existing rates and products
        print("[*] Clearing existing legal insurance tables...")
        cur.execute("TRUNCATE TABLE public.legal_insurance_rates RESTART IDENTITY CASCADE;")
        cur.execute("TRUNCATE TABLE public.legal_insurance_products RESTART IDENTITY CASCADE;")
        
        # 2. Insert products
        for idx, row in unique_products.iterrows():
            company = row["보험회사"]
            product = row["상품명"]
            cur.execute("""
                INSERT INTO public.legal_insurance_products (company_name, product_name, category)
                VALUES (%s, %s, %s)
                ON CONFLICT (product_name) DO NOTHING;
            """, (company, product, '법률비용'))
            
        print(f"[+] Inserted {len(unique_products)} products.")
        
        # 3. Insert rates
        # Columns in public.legal_insurance_rates:
        # product_name, rider_type, coverage_name, payout_reason, payout_amount, male_premium, female_premium, is_renewable, source_file, raw_data
        rates_count = 0
        for idx, row in df.iterrows():
            product_name = row["상품명"]
            rider_type = row["구분"]
            coverage_name = row["담보명(급부명)"]
            payout_reason = row["지급사유"] if pd.notna(row["지급사유"]) else ""
            payout_amount = row["지급금액"] if pd.notna(row["지급금액"]) else ""
            male_premium = row["기준보험료"] if pd.notna(row["기준보험료"]) else ""
            female_premium = row["가입보험료"] if pd.notna(row["가입보험료"]) else ""
            is_renewable = row["갱신구분"] if pd.notna(row["갱신구분"]) else ""
            source_file = row["source_file"]
            
            # Construct raw_data json
            raw_dict = {}
            for col_idx in range(30):
                col_name = f"원본_열_{col_idx}"
                raw_dict[col_name] = row[col_name] if pd.notna(row[col_name]) else ""
            raw_json = json.dumps(raw_dict)
            
            cur.execute("""
                INSERT INTO public.legal_insurance_rates (
                    product_name, rider_type, coverage_name, payout_reason, payout_amount, 
                    male_premium, female_premium, is_renewable, source_file, raw_data
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                product_name, rider_type, coverage_name, payout_reason, payout_amount,
                male_premium, female_premium, is_renewable, source_file, raw_json
            ))
            rates_count += 1
            
        conn.commit()
        print(f"[+] Successfully inserted {rates_count} rates records to public.legal_insurance_rates.")
        
    except Exception as e:
        print(f"[-] Database operation failed: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()
        print("[*] Database connection closed.")

if __name__ == "__main__":
    upload_data()
