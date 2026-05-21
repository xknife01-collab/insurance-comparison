import os
import requests
from dotenv import load_dotenv

load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def hyper_final_audit():
    headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}
    TABLE = "insurance_yu_byung_ja"
    
    res = requests.get(f"{URL}/rest/v1/{TABLE}?select=company_name,product_name,rates", headers=headers)
    data = res.json()
    
    # 1. Junk Search
    junk_kws = ['펫', '반려', '치아', '어린이', '자녀', '아이', '굿앤굿', '스타종합', '상해', '운전자', '자동차']
    junk_found = [d for d in data if any(kw in d['product_name'] for kw in junk_kws)]
    
    # 2. Price Analysis
    prices = sorted([d['rates']['premium_M_40'] for d in data if 'rates' in d and 'premium_M_40' in d['rates']])
    
    # 3. Carrier Diversity
    carriers = {}
    for d in data:
        c = d['company_name']
        carriers[c] = carriers.get(c, 0) + 1
    
    print("\n" + "="*60)
    print("--- [ULTIMATE HYPER PURE AUDIT REPORT] ---")
    print(f"[*] TOTAL GENUINE UBJ PRODUCTS: {len(data)}")
    print(f"[*] JUNK DETECTED (Should be 0): {len(junk_found)}")
    print(f"[*] MINIMUM PREMIUM (Should be > 25k): {prices[0] if prices else 0:,} KRW")
    print(f"[*] CARRIER VARIETY: {len(carriers)} Companies Found")
    print("-" * 60)
    
    # 상위 10개 상품 상세 노출
    print("[*] TOP 10 RECOMMENDATIONS (PREMIUM SAMPLES):")
    sorted_data = sorted(data, key=lambda x: x['rates'].get('premium_M_40', 999999))
    for i, d in enumerate(sorted_data[:10]):
        p = d['rates'].get('premium_M_40', 0)
        print(f"  {i+1}. [{d['company_name']}] {d['product_name'][:35]:<35} | 40M: {p:,}원")
    
    print("-" * 60)
    # 삼성/메리츠 집중 확인
    print("[*] SYNC CHECK (Samsung & Meritz):")
    sm_list = [d for d in data if '삼성' in d['company_name'] or '메리츠' in d['company_name']][:5]
    for d in sm_list:
        p = d['rates'].get('premium_M_40', 0)
        print(f"  - [{d['company_name']}] {d['product_name'][:35]:<35} | 40M: {p:,}원")
    print("="*60 + "\n")

if __name__ == "__main__":
    hyper_final_audit()
