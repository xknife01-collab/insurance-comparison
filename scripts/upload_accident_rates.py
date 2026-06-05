import os
import pandas as pd
import re
import sys
from supabase import create_client
from dotenv import load_dotenv

# Reconfigure stdout to use utf-8 to print Korean characters properly
sys.stdout.reconfigure(encoding='utf-8')

TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident"
combined_xlsx = os.path.join(TARGET_DIR, "extracted_data_combined.xlsx")

def extract_number(val_str):
    if pd.isna(val_str):
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s:
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def upload_accident_data():
    load_dotenv('.env')
    load_dotenv('.env.local')
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in env files")
        return
        
    supabase = create_client(url, key)
    
    # 1. Create table via exec_sql RPC
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS public.accident_products (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL UNIQUE,
        base_premium INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_accident_products_lookup ON public.accident_products (product_name);
    """
    
    print("[*] Attempting to create/verify table public.accident_products via exec_sql...")
    try:
        supabase.rpc('exec_sql', {'sql_query': create_table_sql}).execute()
        print("[+] Table public.accident_products created or verified successfully via RPC.")
    except Exception as e:
        print(f"[-] exec_sql RPC failed (normal if RPC is not configured): {e}")
        print("[*] Proceeding assuming the table is created via SQL Editor.")

    # 2. Read and prepare data from Excel
    if not os.path.exists(combined_xlsx):
        print(f"[-] Combined Excel file not found: {combined_xlsx}")
        return
        
    df = pd.read_excel(combined_xlsx)
    df['male_numeric'] = df['기준보험료'].apply(extract_number)
    df['female_numeric'] = df['가입보험료'].apply(extract_number)
    
    # Filter out rows under 5,000 KRW
    df_filtered = df[(df['male_numeric'] >= 5000) | (df['female_numeric'] >= 5000)].copy()
    
    # Deduplicate
    df_dedup = df_filtered.sort_values(by='male_numeric').drop_duplicates(subset=['보험회사', '상품명'], keep='first')
    print(f"[+] Loaded {len(df_dedup)} unique products >= 5,000 KRW from Excel.")
    
    records = []
    for idx, row in df_dedup.iterrows():
        company = str(row['보험회사']).strip()
        product = str(row['상품명']).strip()
        premium = int(row['male_numeric']) if row['male_numeric'] > 0 else int(row['female_numeric'])
        
        records.append({
            "company_name": company,
            "product_name": product,
            "base_premium": premium
        })
        
    # 3. Clear existing rows
    print("[*] Clearing existing records from accident_products...")
    try:
        supabase.table('accident_products').delete().neq('company_name', 'DELETE_NONE').execute()
        print("[+] Table cleared successfully.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    # 4. Insert rows
    if records:
        print(f"[*] Uploading {len(records)} accident products to Supabase...")
        try:
            supabase.table('accident_products').insert(records).execute()
            print(f"[+] SUCCESS! Successfully uploaded {len(records)} accident products to Supabase.")
        except Exception as e:
            print(f"[-] Failed to upload records: {e}")

if __name__ == "__main__":
    upload_accident_data()
