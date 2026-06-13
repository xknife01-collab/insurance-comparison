# -*- coding: utf-8 -*-
import pandas as pd
import re
import os
import sys
import json
import ssl
import urllib.request
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure\extracted_data.csv"

FALLBACK_LIMITS = {
    "DB손보": {
        "hole_in_one": "200만원",
        "liability": "2000만원",
        "equipment": "100만원"
    },
    "한화손보": {
        "hole_in_one": "200만원",
        "liability": "3000만원",
        "equipment": "미탑재"
    },
    "흥국생명": {
        "hole_in_one": "100만원",
        "liability": "1000만원",
        "equipment": "미탑재"
    },
    "DB생명": {
        "hole_in_one": "300만원",
        "liability": "3000만원",
        "equipment": "미탑재"
    },
    "한화생명": {
        "hole_in_one": "150만원",
        "liability": "2000만원",
        "equipment": "미탑재"
    },
    "삼성화재": {
        "hole_in_one": "200만원",
        "liability": "2000만원",
        "equipment": "100만원"
    },
    "현대해상": {
        "hole_in_one": "200만원",
        "liability": "2000만원",
        "equipment": "100만원"
    }
}

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

def detect_payment_cycle_and_years(row, detail_text):
    co = str(row.get('보험회사', ''))
    text = f"{row.get('상품명', '')} {row.get('상세안내', '')} {detail_text}".lower()
    
    pay_period = "1년납"
    if "일시납" in text or "일시불" in text:
        pay_period = "일시납"
    else:
        match = re.search(r'(\d+)\s*년\s*납', text)
        if match:
            pay_period = f"{match.group(1)}년납"
            
    policy_years = 1
    match_years = re.search(r'(\d+)\s*년\s*(?:만기|보장|동안)', text)
    if match_years:
        policy_years = int(match_years.group(1))
        
    if pay_period == "일시납":
        cycle = "일시납"
    else:
        is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
        if is_non_life:
            cycle = "연납"
        else:
            annual_life_cos = ['흥국생명', '하나생명']
            if any(ac in co for ac in annual_life_cos):
                cycle = "연납"
            else:
                cycle = "월납"
    return cycle, pay_period, policy_years

def extract_limits(group_df):
    hole_in_one = "미탑재"
    liability = "미탑재"
    equipment = "미탑재"
    
    for _, r in group_df.iterrows():
        cov_name = str(r.get('담보명(급부명)', '')).replace(" ", "")
        reason = str(r.get('지급사유', '')).replace(" ", "")
        
        # Try both columns
        amt1 = str(r.get('지급금액', '')).strip() if pd.notna(r.get('지급금액')) else ""
        amt2 = str(r.get('가입금액', '')).strip() if pd.notna(r.get('가입금액')) else ""
        
        amt = ""
        if amt1 and amt1.lower() != 'nan' and amt1 != '-':
            amt = amt1
        elif amt2 and amt2.lower() != 'nan' and amt2 != '-':
            amt = amt2
            
        if not amt:
            continue
            
        if "홀인원" in cov_name or "홀인원" in reason:
            if hole_in_one == "미탑재" or "한도" in amt or "원" in amt:
                hole_in_one = amt
        elif "배상" in cov_name or "배상" in reason:
            if liability == "미탑재" or "한도" in amt or "원" in amt:
                liability = amt
        elif "용품" in cov_name or "손해" in cov_name or "물품" in cov_name:
            if equipment == "미탑재" or "한도" in amt or "원" in amt:
                equipment = amt
                
    return hole_in_one, liability, equipment

def main():
    load_dotenv('.env.local')
    load_dotenv('.env')
    
    url = os.environ.get('VITE_SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        print("[-] Supabase credentials missing.")
        return
        
    if not os.path.exists(CSV_PATH):
        print(f"[-] CSV file not found: {CSV_PATH}")
        return
        
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    print(f"[*] Loaded CSV: {len(df)} rows")
    
    df['보험회사'] = df['보험회사'].apply(lambda x: str(x).replace(" ", "").strip() if pd.notna(x) else x)
    df['상품명'] = df['상품명'].apply(normalize_product_name)
    
    products_list = []
    rates_list = []
    
    # 1. Process Extracted CSV Products
    unique_prods = df['상품명'].unique()
    for prod in unique_prods:
        prod_df = df[df['상품명'] == prod]
        co = prod_df.iloc[0]['보험회사']
        
        # Add to products table list
        products_list.append({
            "company_name": co,
            "product_name": prod,
            "category": "골프"
        })
        
        # Parse premium rows to find base premiums
        male_premiums = []
        female_premiums = []
        
        detail_text = ""
        for _, r in prod_df.iterrows():
            pm = clean_premium(r.get('기준보험료', ''))
            pf = clean_premium(r.get('가입보험료', ''))
            if pm > 0:
                male_premiums.append(pm)
            if pf > 0:
                female_premiums.append(pf)
            if pd.notna(r.get('상세안내')) and r.get('상세안내'):
                detail_text += " " + str(r.get('상세안내'))
                
        # Find minimum non-zero premium or first premium
        base_pm = min(male_premiums) if male_premiums else 0
        base_pf = min(female_premiums) if female_premiums else 0
        
        # If still 0, search raw columns
        if base_pm == 0 or base_pf == 0:
            for _, r in prod_df.iterrows():
                for col in df.columns:
                    if '원본_열' in col:
                        val = str(r[col])
                        val_clean = val.replace(",", "").replace("원", "").replace(" ", "").strip()
                        if val_clean.isdigit():
                            num = int(val_clean)
                            if 2000 <= num <= 200000:
                                if base_pm == 0: base_pm = num
                                if base_pf == 0: base_pf = num
                                
        # Extract coverage limits
        hole_in_one, liability, equipment = extract_limits(prod_df)
        
        # Apply Fallbacks for limits if missing
        fallback_co = next((k for k in FALLBACK_LIMITS if k in co), None)
        if fallback_co:
            f_limits = FALLBACK_LIMITS[fallback_co]
            if hole_in_one == "미탑재" or hole_in_one.lower() == "nan" or not hole_in_one:
                hole_in_one = f_limits["hole_in_one"]
            if liability == "미탑재" or liability.lower() == "nan" or not liability:
                liability = f_limits["liability"]
            if equipment == "미탑재" or equipment.lower() == "nan" or not equipment:
                equipment = f_limits["equipment"]
                
        # Clean final strings
        if not hole_in_one or hole_in_one.lower() == 'nan': hole_in_one = "미탑재"
        if not liability or liability.lower() == 'nan': liability = "미탑재"
        if not equipment or equipment.lower() == 'nan': equipment = "미탑재"
        
        # Detect payment cycle
        cycle, pay_period, policy_years = detect_payment_cycle_and_years(prod_df.iloc[0], detail_text)
        
        # Standard Plan Level
        plan_level = "표준형"
        if "실속" in prod or "실속" in detail_text:
            plan_level = "실속형"
        elif "vip" in prod.lower() or "vip" in detail_text.lower() or "ceo" in prod.lower():
            plan_level = "VIP안심형"
            
        details_json = {
            "payment_cycle": cycle,
            "payment_period": pay_period,
            "policy_years": policy_years,
            "original_premium_male": base_pm,
            "original_premium_female": base_pf
        }
        
        # Add Male Rate
        rates_list.append({
            "product_name": prod,
            "plan_level": plan_level,
            "gender": "M",
            "age": 40,
            "premium": base_pm,
            "coverage_limit_hole_in_one": hole_in_one,
            "coverage_limit_liability": liability,
            "coverage_limit_equipment": equipment,
            "details": details_json
        })
        
        # Add Female Rate
        rates_list.append({
            "product_name": prod,
            "plan_level": plan_level,
            "gender": "F",
            "age": 40,
            "premium": base_pf,
            "coverage_limit_hole_in_one": hole_in_one,
            "coverage_limit_liability": liability,
            "coverage_limit_equipment": equipment,
            "details": details_json
        })

    # 2. Add Mock Products for Samsung and Hyundai (to support comprehensive UI lists)
    mock_products = [
        {"company": "삼성화재", "product": "삼성화재 다이렉트 착한골프보험", "premium": 9500},
        {"company": "현대해상", "product": "현대해상 다이렉트 골프보험", "premium": 10800}
    ]
    
    for mp in mock_products:
        # Check if already in products_list
        if not any(p["product_name"] == mp["product"] for p in products_list):
            products_list.append({
                "company_name": mp["company"],
                "product_name": mp["product"],
                "category": "골프"
            })
            
            f_limits = FALLBACK_LIMITS[mp["company"]]
            details_json = {
                "payment_cycle": "연납",
                "payment_period": "1년납",
                "policy_years": 1,
                "original_premium_male": mp["premium"],
                "original_premium_female": mp["premium"]
            }
            
            # Add Male
            rates_list.append({
                "product_name": mp["product"],
                "plan_level": "표준형",
                "gender": "M",
                "age": 40,
                "premium": mp["premium"],
                "coverage_limit_hole_in_one": f_limits["hole_in_one"],
                "coverage_limit_liability": f_limits["liability"],
                "coverage_limit_equipment": f_limits["equipment"],
                "details": details_json
            })
            
            # Add Female
            rates_list.append({
                "product_name": mp["product"],
                "plan_level": "표준형",
                "gender": "F",
                "age": 40,
                "premium": mp["premium"],
                "coverage_limit_hole_in_one": f_limits["hole_in_one"],
                "coverage_limit_liability": f_limits["liability"],
                "coverage_limit_equipment": f_limits["equipment"],
                "details": details_json
            })
        
    print(f"[*] Total after adding mocks: {len(products_list)} products and {len(rates_list)} rates.")
    
    # REST API Header
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    # 1. Upload Products (Upsert/Insert)
    print("[*] Uploading products to golf_insurance_products...")
    req_prod = urllib.request.Request(
        f"{url}/rest/v1/golf_insurance_products?on_conflict=product_name",
        headers=headers,
        data=json.dumps(products_list).encode('utf-8')
    )
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req_prod, context=context) as resp:
            print("[+] Products uploaded successfully.")
    except Exception as e:
        print("[-] Failed to upload products:", e)
        
    # 2. Clear golf_insurance_rates
    print("[*] Clearing golf_insurance_rates...")
    req_clear = urllib.request.Request(
        f"{url}/rest/v1/golf_insurance_rates?id=neq.-1",
        headers=headers,
        method="DELETE"
    )
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req_clear, context=context) as resp:
            print("[+] Table cleared.")
    except Exception as e:
        print("[-] Failed to clear golf_insurance_rates:", e)
        
    # 3. Upload Rates
    print("[*] Uploading rates to golf_insurance_rates...")
    req_rates = urllib.request.Request(
        f"{url}/rest/v1/golf_insurance_rates",
        headers=headers,
        data=json.dumps(rates_list).encode('utf-8')
    )
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req_rates, context=context) as resp:
            print("[+] Rates uploaded successfully!")
            print("[SUCCESS] Golf insurance rates pipeline seeding complete!")
    except Exception as e:
        print("[-] Failed to upload rates:", e)
        if hasattr(e, 'read'):
            print("Response:", e.read().decode('utf-8'))

if __name__ == '__main__':
    main()
