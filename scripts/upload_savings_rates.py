# -*- coding: utf-8 -*-
import os
import pandas as pd
import json
import warnings
from supabase import create_client
from dotenv import load_dotenv

warnings.filterwarnings('ignore')

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\savings\extracted_data.csv"

def get_product_features(company, product_name, interest_rate_str):
    is_cm = any(k in product_name for k in ['다이렉트', '인터넷', 'e-', '라플', '온라인', 'CM'])
    features = []
    
    # 1. Channel
    if is_cm:
        if "일시납" in product_name:
            features.append("인터넷 CM 전용 최저 수수료(사업비 3.0%)")
        else:
            features.append("인터넷 CM 전용 최저 수수료(사업비 3.5%)")
    else:
        if "일시납" in product_name:
            features.append("오프라인 대면 밀착 케어 (사업비 4.0%)")
        else:
            features.append("오프라인 대면 밀착 케어 (사업비 5.0%)")
            
    # 2. Interest Rate Feature
    rate = None
    if interest_rate_str and interest_rate_str != '-':
        try:
            rate = float(interest_rate_str.replace('%', '').strip())
        except Exception:
            rate = None
            
    if rate is not None:
        if rate >= 3.0:
            features.append(f"업계 최우수 공시이율 ({interest_rate_str})")
        elif rate >= 2.5:
            features.append(f"안정적인 고금리 이율 ({interest_rate_str})")
        else:
            features.append(f"안정 보장형 복리 이율 ({interest_rate_str})")
    else:
        features.append("표준 복리 이율 제공 (2.80% 적용)")
        
    # 3. Company Brand Value
    if '삼성' in company:
        features.append("자산 규모 1위 삼성금융 브랜드의 절대 안정성")
    elif '한화' in company:
        features.append("자유로운 중도 인출 및 추가 납입 유연성")
    elif '교보' in company:
        features.append("유니버셜 기능 결합 및 안정적 최저보증이율")
    elif '동양' in company:
        features.append("연금 개시 전후 유연한 플랜 구성")
    elif '현대' in company:
        features.append("고객 케어 및 다이렉트 편의성 제공")
    else:
        features.append("예금자보호법 적용 대상 및 최저보증 안전망")
        
    return " | ".join(features)

def clean_numeric(val):
    if pd.isna(val) or val is None:
        return 0
    val_str = str(val).replace(',', '').replace('원', '').replace('%', '').replace('구좌', '').replace(' ', '').strip()
    try:
        return float(val_str)
    except ValueError:
        return 0

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
    print(f"[+] Loaded CSV with {len(df)} rows.")
    
    # 1. Clear existing general savings from pension_products
    print("[*] Clearing general savings products from pension_products table...")
    try:
        # product_name contains "저축" and NOT contains "연금"
        supabase.table("pension_products")\
            .delete()\
            .ilike("product_name", "%저축%")\
            .not_.ilike("product_name", "%연금%")\
            .execute()
        print("[+] Table pension_products cleared of general savings.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    # 2. Extract and format records
    records_list = []
    for idx, row in df.iterrows():
        company = str(row["보험회사"]) if pd.notna(row["보험회사"]) else ""
        product = str(row["상품명"]) if pd.notna(row["상품명"]) else ""
        period = str(row["구분"]) if pd.notna(row["구분"]) else ""
        accum_premium = str(row["담보명(급부명)"]) if pd.notna(row["담보명(급부명)"]) else ""
        
        # 지급사유 (male_acc_amt) and 지급금액 (male_acc_rate)
        reason = str(row["지급사유"]) if pd.notna(row["지급사유"]) else ""
        amount = str(row["지급금액"]) if pd.notna(row["지급금액"]) else ""
        
        surrender_val = clean_numeric(reason)
        refund_rate = clean_numeric(amount)
        
        applied_rate = str(row["적용이율"]) if pd.notna(row["적용이율"]) else ""
        channel = str(row["판매채널"]) if pd.notna(row["판매채널"]) else ""
        base_date = str(row["기준일자"]) if pd.notna(row["기준일자"]) else ""
        description = str(row["상세안내"]) if pd.notna(row["상세안내"]) else ""
        contact = str(row["연락처"]) if pd.notna(row["연락처"]) else ""
        source_file = str(row["source_file"]) if pd.notna(row["source_file"]) else ""
        
        features = get_product_features(company, product, applied_rate)
        
        records_list.append({
            "company": company,
            "product_name": product,
            "period": period,
            "accum_premium": accum_premium,
            "surrender_value": surrender_val,
            "refund_rate": refund_rate,
            "interest_rate": applied_rate,
            "channel": channel,
            "base_date": base_date,
            "description": description,
            "contact": contact,
            "source_file": source_file,
            "features": features
        })
        
    # Batch insert (500 rows per batch)
    batch_size = 500
    print(f"[*] Uploading {len(records_list)} records in batches of {batch_size}...")
    for i in range(0, len(records_list), batch_size):
        batch = records_list[i : i + batch_size]
        try:
            supabase.table("pension_products").insert(batch).execute()
            print(f"[+] Uploaded batch {i//batch_size + 1} ({i + len(batch)}/{len(records_list)})")
        except Exception as e:
            print(f"[-] Failed to upload batch at index {i}: {e}")
            return
            
    print("[+] SUCCESS! All General Savings products successfully uploaded to Supabase.")

if __name__ == "__main__":
    upload_data()
