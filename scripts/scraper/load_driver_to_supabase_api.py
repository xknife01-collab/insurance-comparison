import os
import pandas as pd
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not URL or not KEY:
    print("[!] Supabase URL or Key not found in environment!")
    exit(1)

def load_driver_data_via_api():
    # Clean up old data via API first
    print("[*] Cleaning up existing driver data in Supabase via API...")
    headers_del = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Prefer": "return=minimal"
    }
    try:
        # Delete rates first
        requests.delete(f"{URL}/rest/v1/driver_insurance_rates?age=eq.40", headers=headers_del)
        # Delete products
        requests.delete(f"{URL}/rest/v1/driver_insurance_products?category=eq.driver", headers=headers_del)
        print("  [+] Existing database rows cleared successfully.")
    except Exception as e:
        print(f"  [!] Failed to clear existing database rows: {e}")

    csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv'
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    
    # Filter for rows that have at least one premium
    df['기준보험료_num'] = pd.to_numeric(df['기준보험료'], errors='coerce')
    df['가입보험료_num'] = pd.to_numeric(df['가입보험료'], errors='coerce')
    df = df[df['기준보험료_num'].notna() | df['가입보험료_num'].notna()].copy()
    
    # Unique product quotes
    products_map = {}
    for idx, row in df.iterrows():
        comp = str(row.get('보험회사', '')).strip()
        prod = str(row.get('상품명', '')).strip()[:250]
        
        if not comp or comp == 'nan':
            continue
        if not prod or prod == 'nan':
            continue
            
        key = (comp, prod)
        
        raw_m = row.get('기준보험료_num')
        raw_f = row.get('가입보험료_num')
        
        m_val = int(raw_m) if pd.notna(raw_m) else None
        f_val = int(raw_f) if pd.notna(raw_f) else None
        
        if m_val is None and f_val is not None:
            m_val = f_val
        if f_val is None and m_val is not None:
            f_val = m_val
        if m_val is None and f_val is None:
            continue
            
        # Keep the minimum premium if there are multiple rows for the same product
        if key not in products_map:
            products_map[key] = {'male': m_val, 'female': f_val}
        else:
            products_map[key]['male'] = min(products_map[key]['male'], m_val)
            products_map[key]['female'] = min(products_map[key]['female'], f_val)
            
    print(f"[*] Found {len(products_map)} unique driver insurance products.")
    
    # Prepare payloads
    products_payload = []
    rates_payload = []
    
    seen_products = set()
    for (comp, prod), prems in products_map.items():
        # Product item
        if prod not in seen_products:
            seen_products.add(prod)
            products_payload.append({
                "company_name": comp,
                "product_name": prod,
                "category": "driver"
            })
        
        base_m = prems['male']
        base_f = prems['female']
        
        plans = [
            {
                'level': '실속형',
                'add_prem': 6000,
                'min_prem': 9900,
                'traffic': '1억 원',
                'lawyer': '3,000만 원',
                'fine': '대인 2,000만 원',
                'details': {'자부상': '미탑재', '교통사고처리지원금': '1억 원 한도', '변호사선임비용': '3,000만 원 한도', '벌금': '대인 2,000만 원 한도'}
            },
            {
                'level': '표준형',
                'add_prem': 11000,
                'min_prem': 15000,
                'traffic': '1.5억 원',
                'lawyer': '5,000만 원',
                'fine': '대인 3,000만 원',
                'details': {'자부상': '14급 기준 10만 원', '교통사고처리지원금': '1.5억 원 한도', '변호사선임비용': '5,000만 원 한도', '벌금': '대인 3,000만 원 한도'}
            },
            {
                'level': 'VIP안심형',
                'add_prem': 21000,
                'min_prem': 25000,
                'traffic': '2억 원',
                'lawyer': '5,000만 원 (경찰조사 선지원 포함)',
                'fine': '대인 3,000만 / 대물 500만 원',
                'details': {'자부상': '14급 기준 30만 원', '교통사고처리지원금': '2억 원 한도', '변호사선임비용': '5,000만 원 한도 (경찰조사 선지원 포함)', '벌금': '대인 3,000만 / 대물 500만 원 한도'}
            }
        ]
        
        # Build rates for Male and Female for each of the 3 plan levels (at age 40)
        for plan in plans:
            prem_m = max(base_m + plan['add_prem'], plan['min_prem'])
            prem_f = max(base_f + plan['add_prem'], plan['min_prem'])
            
            # Male rate
            rates_payload.append({
                "product_name": prod,
                "plan_level": plan['level'],
                "gender": "M",
                "age": 40,
                "premium": prem_m,
                "coverage_limit_traffic_accident": plan['traffic'],
                "coverage_limit_lawyer": plan['lawyer'],
                "coverage_limit_fine": plan['fine'],
                "details": plan['details']
            })
            
            # Female rate
            rates_payload.append({
                "product_name": prod,
                "plan_level": plan['level'],
                "gender": "F",
                "age": 40,
                "premium": prem_f,
                "coverage_limit_traffic_accident": plan['traffic'],
                "coverage_limit_lawyer": plan['lawyer'],
                "coverage_limit_fine": plan['fine'],
                "details": plan['details']
            })

    # HTTP headers for Supabase API
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    # 1. Upsert Products
    print(f"[*] Uploading {len(products_payload)} products to driver_insurance_products...")
    prod_url = f"{URL}/rest/v1/driver_insurance_products?on_conflict=product_name"
    
    # Batch request (50 items each)
    batch_size = 50
    p_success = 0
    for i in range(0, len(products_payload), batch_size):
        batch = products_payload[i : i + batch_size]
        try:
            res = requests.post(prod_url, headers=headers, json=batch)
            if res.status_code in [200, 201, 204]:
                p_success += len(batch)
            else:
                print(f"    [!] Product upload error ({res.status_code}): {res.text}")
        except Exception as e:
            print(f"    [!] Product upload failed: {e}")
            
    # 2. Upsert Rates
    print(f"[*] Uploading {len(rates_payload)} rates to driver_insurance_rates...")
    rates_url = f"{URL}/rest/v1/driver_insurance_rates"
    
    r_success = 0
    for i in range(0, len(rates_payload), batch_size):
        batch = rates_payload[i : i + batch_size]
        try:
            res = requests.post(rates_url, headers=headers, json=batch)
            if res.status_code in [200, 201, 204]:
                r_success += len(batch)
            else:
                print(f"    [!] Rate upload error ({res.status_code}): {res.text}")
        except Exception as e:
            print(f"    [!] Rate upload failed: {e}")
            
    print(f"\n[+] API Load Report:")
    print(f"  - Products successfully upserted: {p_success} / {len(products_payload)}")
    print(f"  - Rates successfully upserted: {r_success} / {len(rates_payload)}")

if __name__ == "__main__":
    load_driver_data_via_api()
