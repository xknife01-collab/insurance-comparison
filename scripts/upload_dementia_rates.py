# -*- coding: utf-8 -*-
import pandas as pd
import re
import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

def clean_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    match = re.search(r'(\d+)', s)
    return int(match.group(1)) if match else 0

def normalize_product_name(name):
    if not name or pd.isna(name):
        return ""
    s = str(name).strip()
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\s*\(\s*', '(', s)
    s = re.sub(r'\s*\)\s*', ')', s)
    s = re.sub(r'\s*\[\s*', '[', s)
    s = re.sub(r'\s*\]\s*', ']', s)
    return s

def parse_benefit_to_num(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace(' ', '').strip()
    match_billion = re.search(r'(\d+(?:\.\d+)?)\s*(?:억원|억)', s)
    if match_billion:
        return float(match_billion.group(1)) * 100000000
    match_million = re.search(r'(\d+(?:\.\d+)?)\s*(?:만원|만)', s)
    if match_million:
        return float(match_million.group(1)) * 10000
    if "%" not in s and "％" not in s and "배" not in s:
        match_num_won = re.search(r'(\d+)원', s)
        if match_num_won:
            return float(match_num_won.group(1))
        match_num = re.search(r'(\d+)', s)
        if match_num:
            val = float(match_num.group(1))
            if val >= 1000:
                return val
    return 0

STANDARD_BASE = 10_000_000  # 1,000만원 기준으로 정규화

# 정규화 제외 담보 키워드 (진단비와 다른 성격의 부가특약/생활자금)
NORMALIZATION_EXCLUDE_KEYWORDS = [
    '납입면제', '만기연장불가', '체증불가',
    '일시납', '사망', '재해사망', '질병사망',
    '재가', '시설', '생활자금', '생활비', '간병비', '간병생활', '매월', '월지급',
    '간병급여', '간병연금', '간병자금', '간병지원', '간병인'
]

# 정규화 대상 담보 키워드 (치매진단비, 간병진단비 계열만)
NORMALIZATION_INCLUDE_KEYWORDS = [
    '치매진단', '경증이상치매', '중등증이상치매', '중증치매',
    '경도이상치매', '중등도이상치매', '경도치매', '중등도치매',
    '치매보장', '장기간병요양진단'
]

def normalize_to_standard_unit(pm, pf, insured_amount_str, benefit_name=''):
    """
    치매 진단비 계열 담보에한해서만 보험가입금액 기준 1,000만원 단위로 정규화.
    - 10만원 기준 진단비: ×100
    - 100만원 기준: ×10
    - 1,000만원 기준: ×1 (변경 없음)
    - 보험료납입면제/만기연장불가 등 부가특약: 스케일 제외
    """
    bn = str(benefit_name)
    # 제외 키워드가 있으면 정규화 안 함
    for kw in NORMALIZATION_EXCLUDE_KEYWORDS:
        if kw in bn:
            return pm, pf
    # 대상 키워드가 없으면 정규화 안 함
    if not any(kw in bn for kw in NORMALIZATION_INCLUDE_KEYWORDS):
        return pm, pf
    
    if not insured_amount_str or pd.isna(insured_amount_str):
        return pm, pf
    s = str(insured_amount_str)
    # '보험가입금액의 X%' 형태 → 스케일 불가, 그대로
    if '%' in s or '배' in s:
        return pm, pf
    amount = parse_benefit_to_num(s)
    if amount <= 0:
        return pm, pf
    factor = STANDARD_BASE / amount
    # factor가 너무 크거나 작으면 비정상 데이터이므로 원본 유지
    if factor > 1000 or factor < 0.001:
        return pm, pf
    return int(round(pm * factor)), int(round(pf * factor))

def clean_val_to_num(v):
    if pd.isna(v) or v is None:
        return 0
    s = str(v).replace(",", "").replace(" ", "").replace("원", "")
    if not s or s == "-":
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def detect_payment_cycle_and_years(row):
    co = str(row.get('보험회사', ''))
    prod = str(row.get('상품명', ''))
    text = " ".join([str(v) for v in row.values if pd.notna(v)])
    
    # 1. Detect payment period (e.g. 20년납, 10년납, 일시납)
    pay_period = "20년납"
    if "일시납" in text or "일시불" in text:
        pay_period = "일시납"
    else:
        criteria_match = re.search(r'(?:기준|예시|공시)[^.]*?(\d+)\s*년\s*납', text)
        if criteria_match:
            pay_period = f"{criteria_match.group(1)}년납"
        else:
            match = re.search(r'(\d+)\s*년\s*납', text)
            if match:
                pay_period = f"{match.group(1)}년납"
            else:
                for years in [20, 10, 30, 15, 5, 7]:
                    if f"{years}년" in text:
                        pay_period = f"{years}년납"
                        break
                        
    # 2. Detect policy period/years (만기 년수, e.g. 20년 만기, 10년 만기)
    policy_years = 20
    criteria_years_match = re.search(r'(?:기준|예시|공시)[^.]*?(\d+)\s*년\s*(?:만기|보장|동안)', text)
    if criteria_years_match:
        policy_years = int(criteria_years_match.group(1))
    else:
        match_years = re.search(r'(\d+)\s*년\s*(?:만기|보장|동안)', text)
        if match_years:
            policy_years = int(match_years.group(1))
        else:
            match_standalone = re.search(r'(\d+)\s*년', text)
            if match_standalone:
                val = int(match_standalone.group(1))
                if val in [5, 7, 10, 15, 20, 30]:
                    policy_years = val
                    
    # 3. Detect payment cycle (월납 vs 연납 vs 일시납)
    if pay_period == "일시납":
        cycle = "일시납"
    else:
        # Non-life check
        is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
        # Check if the company belongs to the known annual payment life insurance companies
        annual_life_cos = ['흥국생명', 'DB생명', 'iM라이프', '동양생명', 'KB라이프생명', '하나생명', '한화생명']
        is_annual_life = any(ac in co for ac in annual_life_cos)
        
        if is_non_life or is_annual_life:
            cycle = "연납"
        else:
            cycle = "월납"
                        
    return cycle, pay_period, policy_years

def upload_dementia_data():
    load_dotenv('.env.local')
    load_dotenv('.env')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing in environment.")
        return
        
    supabase = create_client(url, key)
    
    csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
    if not os.path.exists(csv_path):
        print(f"[-] File not found: {csv_path}")
        return
        
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    # Normalize product names and company names to prevent duplicate categories from spacing mismatches
    df['보험회사'] = df['보험회사'].apply(lambda x: str(x).replace(" ", "").strip() if pd.notna(x) else x)
    df['상품명'] = df['상품명'].apply(normalize_product_name)
    
    records = []
    for idx, row in df.iterrows():
        # Clean premiums
        pm = clean_premium(row.get('남성보험료', ''))
        pf = clean_premium(row.get('여성보험료', ''))
        
        # 적용이율 검출
        rate_val = row.get('적용이율', '')
        if pd.isna(rate_val) or str(rate_val).strip() == '':
            for col in df.columns:
                if '원본_열' in col:
                    val = str(row[col])
                    if '%' in val and re.search(r'\d+\.?\d*\s*%', val):
                        rate_val = val.strip()
                        break
        
        rate_str = str(rate_val) if pd.notna(rate_val) else ""
        co = str(row.get('보험회사', ''))
        prod = str(row.get('상품명', ''))
        
        cycle, pay_period, policy_years = detect_payment_cycle_and_years(row)
        
        if cycle == "연납":
            pm = int(round(pm / 12)) if pm > 0 else 0
            pf = int(round(pf / 12)) if pf > 0 else 0
            applied_rate_str = f"월납(연납환산, {pay_period})"
        elif cycle == "일시납":
            pm = int(round(pm / (policy_years * 12.0))) if pm > 0 else 0
            pf = int(round(pf / (policy_years * 12.0))) if pf > 0 else 0
            applied_rate_str = f"월납(일시납환산, {policy_years}년만기)"
        else:
            applied_rate_str = f"월납({pay_period})"
        
        # Determine whether to use '가입금액' or '지급금액' for face amount normalization
        is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
        insured_amt_str = ''
        if not is_non_life:
            # Life insurer: try to use '가입금액' first (as it holds the nominal contract base like 1,000만원)
            cand = str(row.get('가입금액', '')) if pd.notna(row.get('가입금액', '')) else ''
            if cand and parse_benefit_to_num(cand) > 0:
                insured_amt_str = cand
        
        # Fallback to '지급금액' (or default for non-life)
        if not insured_amt_str:
            insured_amt_str = str(row.get('지급금액', '')) if pd.notna(row.get('지급금액', '')) else ''
            
        benefit_nm = str(row.get('담보명(급부명)', '')) if pd.notna(row.get('담보명(급부명)', '')) else ''
        pm, pf = normalize_to_standard_unit(pm, pf, insured_amt_str, benefit_name=benefit_nm)
        
        records.append({
            "company_name": co[:50],
            "product_name": prod[:200],
            "division": str(row['구분'])[:50] if pd.notna(row['구분']) else "",
            "benefit_name": str(row['담보명(급부명)'])[:200],
            "benefit_reason": str(row['지급사유']) if pd.notna(row['지급사유']) else "",
            "benefit_amount": str(row['지급금액']) if pd.notna(row['지급금액']) else "",
            "insured_amount": str(row['가입금액']) if pd.notna(row['가입금액']) else "",
            "premium_male": pm,
            "premium_female": pf,
            "applied_rate": applied_rate_str[:50],
            "source_file": str(row['source_file'])[:100] if pd.notna(row['source_file']) else ""
        })
        
    print(f"[*] Clearing insurance_dementia_rates table...")
    try:
        supabase.table('insurance_dementia_rates').delete().neq('id', -1).execute()
        print("[+] Table cleared.")
    except Exception as e:
        print(f"[-] Error clearing table: {e}")
        return
        
    if records:
        print(f"[*] Uploading {len(records)} dementia care records...")
        # Upload in chunks of 1000 to prevent payload limit errors
        chunk_size = 1000
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            try:
                supabase.table('insurance_dementia_rates').insert(chunk).execute()
                print(f"[+] Uploaded chunk {i // chunk_size + 1}/{-(-len(records) // chunk_size)}")
            except Exception as e:
                print(f"[-] Upload failed for chunk {i // chunk_size + 1}: {e}")
                return
        print("[+] SUCCESS! Supabase insurance_dementia_rates table is now updated with clean text.")

if __name__ == "__main__":
    upload_dementia_data()
