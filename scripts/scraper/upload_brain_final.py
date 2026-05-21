import pandas as pd
import requests
import os
from dotenv import load_dotenv
import time

# Load env
load_dotenv(".env.local")
load_dotenv(".env")

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not found.")
    exit(1)

EXCEL_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\뇌보험_담보_통합_최종_성별분리.xlsx'

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def delete_all(table):
    print(f"[*] Deleting all data from {table}...", flush=True)
    # PostgREST DELETE requires a filter. We use a filter that matches everything.
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=gt.0"
    r = requests.delete(url, headers=headers)
    if r.status_code in [200, 204]:
        print(f"  [+] Deleted successfully.", flush=True)
    else:
        print(f"  [!] Delete failed: {r.status_code} {r.text}", flush=True)

def upload_data():
    if not os.path.exists(EXCEL_FILE):
        print(f"Error: {EXCEL_FILE} not found.", flush=True)
        return

    df = pd.read_excel(EXCEL_FILE)
    
    # Filter out '소방관'
    df = df[~df['상품명'].str.contains('소방관', na=False)]
    
    print(f"[*] Reading {len(df)} rows from Excel after filtering...", flush=True)

    # 1. Clear tables
    delete_all("brain_insurance_rates")
    delete_all("brain_insurance_products")

    # 2. Insert Products and Rates
    unique_products = df[['보험회사', '상품명']].drop_duplicates()
    
    print(f"[*] Inserting {len(unique_products)} unique products...", flush=True)
    product_category_map = {}
    for i, row in unique_products.iterrows():
        product_name = str(row['상품명']).strip()
        company_name = str(row['보험회사']).strip()
        
        # Determine category based on the first occurrence of coverage name for this product
        coverage_name = str(df[df['상품명'] == product_name]['담보명(급부명)'].iloc[0])
        category = "뇌혈관질환"
        if "뇌졸중" in coverage_name:
            category = "뇌졸중"
        elif "뇌출혈" in coverage_name:
            category = "뇌출혈"
        
        product_category_map[product_name] = category
        
        r = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_products", headers=headers, json={
            "product_name": product_name,
            "company_name": company_name,
            "category": category
        })
        if r.status_code not in [201, 204]:
            print(f"  [!] Failed to insert product {product_name}: {r.text}", flush=True)

    print(f"[*] Inserting {len(df) * 2} rate entries (Male & Female)...", flush=True)
    success_count = 0
    for i, row in df.iterrows():
        product_name = str(row['상품명']).strip()
        coverage_name = str(row['담보명(급부명)']).strip()
        reason = str(row.get('지급사유', '')).strip()
        
        male_premium = int(row['남성보험료'])
        female_premium = int(row['여성보험료'])
        renewal_type = str(row.get('갱신구분', '')).strip()

        # Male Rate
        r_m = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates", headers=headers, json={
            "product_name": product_name,
            "gender": "M",
            "age": 40,
            "premium": male_premium,
            "benefit_name": coverage_name,
            "benefit_amount": reason,
            "raw_data": { "renewal_type": renewal_type }
        })
        
        # Female Rate
        r_f = requests.post(f"{SUPABASE_URL}/rest/v1/brain_insurance_rates", headers=headers, json={
            "product_name": product_name,
            "gender": "F",
            "age": 40,
            "premium": female_premium,
            "benefit_name": coverage_name,
            "benefit_amount": reason,
            "raw_data": { "renewal_type": renewal_type }
        })
        
        if r_m.status_code in [201, 204] and r_f.status_code in [201, 204]:
            success_count += 2
            if (i + 1) % 10 == 0:
                print(f"  [+] Processed {i+1} rows...", flush=True)
        else:
            print(f"  [!] Error at row {i}: {r_m.text} / {r_f.text}", flush=True)

    print(f"\n[*] Finished! Total rates inserted: {success_count}", flush=True)

if __name__ == "__main__":
    upload_data()
