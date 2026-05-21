import os
import requests
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def verify_goal():
    headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}
    
    # 1. 전수 조사
    res = requests.get(f"{URL}/rest/v1/insurance_yu_by_ja?select=company_name,product_name,rates", headers=headers)
    data = res.json()
    
    if "message" in data:
        print(f"Error: {data['message']}")
        return

    # 2. 잡동사니 체크
    junk_kws = ['펫', '반려', '강아지', '고양이', '치아', '어린이', '자녀', '아이', '상해', '운전자', '자동차']
    junk_found = [d for d in data if any(kw in str(d.get('product_name', '')) for kw in junk_kws)]
    
    # 3. 회사별 카운트
    counts = {}
    for d in data:
        c = d['company_name']
        counts[c] = counts.get(c, 0) + 1
    
    print("\n" + "="*50)
    print("--- [GOAL PERFORMANCE REPORT] ---")
    print(f"[*] Total Products Loaded: {len(data)}")
    print(f"[*] Junk Products (Excluded): {len(junk_found)}")
    print(f"[*] Carrier Variety: {len(counts)} Carriers")
    print("-" * 50)
    
    # 상위 10개 보험사 카운트 출력
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    for carrier, count in sorted_counts[:10]:
        print(f"  {carrier:<15}: {count} products")
    
    print("-" * 50)
    # 삼성/메리츠의 40세 남성 보험료 실측
    print("[*] Sample Gold Check (40M Premiums):")
    samples = [d for d in data if '삼성' in d['company_name'] or '메리츠' in d['company_name']][:5]
    for d in samples:
        prem = d['rates'].get('premium_M_40')
        print(f"  [{d['company_name']}] {d['product_name'][:30]} | {prem:,}원")
    print("="*50 + "\n")

if __name__ == "__main__":
    verify_goal()
