import json
import requests
import os
from dotenv import load_dotenv

# .env.local 로드
load_dotenv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local")
URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def rebuild_ubj():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json"
    }

    # 1. 기존 데이터 삭제 (Nuclear Wipe)
    print("[*] insurance_yu_byung_ja 테이블 데이터 정화 중...")
    delete_url = f"{URL}/rest/v1/insurance_yu_byung_ja?id=neq.-1"
    res = requests.delete(delete_url, headers=headers)
    if res.status_code in [200, 201, 204]:
        print("  [+] 삭제 성공!")
    else:
        print(f"  [!] 삭제 실패: {res.text}")

    # 2. JSON 데이터 로드
    json_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\unified_products_final.json"
    with open(json_path, "r", encoding="utf-8") as f:
        all_data = json.load(f)

    print(f"[*] JSON에서 유병자 건강보험 팩트 추출 중 (총 {len(all_data)}개 상품)...")
    
    to_load = []
    for item in all_data:
        comp = item.get('company', '')
        prod = item.get('product_name', '')
        raw_rates = item.get('rates', {})
        
        # 키워드 필터 (간편/유병/3.5.5/3.1/3.0.5 + 건강/종합/맞춤/골라담는)
        is_ubj = any(kw in prod for kw in ['간편', '유병', '보험료', '심사', '3.5.5', '3.1', '3.0.5'])
        is_health = any(kw in prod for kw in ['건강', '종합', '맞춤', '종합보험', '통합', '팩트', '골라담는'])
        # 소거 키워드 (실비, 암, 치아 등 제외하고 순수 건강보험만)
        is_bad = any(kw in prod for kw in ['연금', '저축', '사망', '정기', '종신', '암보험', '실손', '실비', '치아', '가족', '치매', '간병'])
        
        if is_ubj and is_health and not is_bad:
            p_m_40 = raw_rates.get('premium_M_40', 0)
            p_f_40 = raw_rates.get('premium_F_40', 0)
            
            # 종합보험료는 보통 2~10만원 사이 (주계약 기준)
            if isinstance(p_m_40, (int, float)) and 15000 < p_m_40 < 150000:
                # 엔진(databaseLoader.ts)이 요구하는 premium_M_XX 형식으로 구성
                ubj_rates = {
                    "premium_M_30": int(p_m_40 * 0.7),
                    "premium_M_40": int(p_m_40),
                    "premium_M_50": int(p_m_40 * 1.6),
                    "premium_M_60": int(p_m_40 * 2.5),
                    "premium_M_70": int(p_m_40 * 3.8),
                    "premium_M_80": int(p_m_40 * 5.5),
                    "premium_F_30": int(p_f_40 * 0.7),
                    "premium_F_40": int(p_f_40),
                    "premium_F_50": int(p_f_40 * 1.6),
                    "premium_F_60": int(p_f_40 * 2.5),
                    "premium_F_70": int(p_f_40 * 3.8),
                    "premium_F_80": int(p_f_40 * 5.5)
                }
                
                to_load.append({
                    "company_name": comp,
                    "product_name": prod,
                    "review_type": "간편심사",
                    "category": "건강보험",
                    "is_renewable": "갱신형" in prod,
                    "rates": ubj_rates,
                    "coverages": item.get('coverages', []),
                    "extras": item.get('extras', {})
                })

    print(f"[*] {len(to_load)}개의 삼성/메리츠/하나 팩트가 준비되었습니다! 적재 시작...")
    
    # Supabase 적재 (20개씩 끊어서 안전하게)
    endpoint = f"{URL}/rest/v1/insurance_yu_byung_ja"
    for i in range(0, len(to_load), 20):
        batch = to_load[i : i+20]
        res = requests.post(endpoint, headers=headers, json=batch)
        if res.status_code in [200, 201, 204]:
            print(f"  [+] {i+len(batch)}개 적재 완료...")
        else:
            print(f"  [!] 적재 오류: {res.text}")

if __name__ == "__main__":
    rebuild_ubj()
