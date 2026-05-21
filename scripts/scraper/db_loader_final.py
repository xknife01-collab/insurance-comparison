import json
import requests
import os
import uuid
from dotenv import load_dotenv

# .env.local 및 .env 로드
load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def upsert_data(table, data_list):
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    endpoint = f"{URL}/rest/v1/{table}"
    
    # 50개씩 끊어서 전송
    batch_size = 50
    success = 0
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i : i + batch_size]
        try:
            resp = requests.post(endpoint, headers=headers, json=batch)
            if resp.status_code in [200, 201, 204]:
                success += len(batch)
                print(f"  [+] {table} 동기화 중... ({success}/{len(data_list)})")
            else:
                print(f"  [!] {table} 오류: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"  [!] {table} 예외 발생: {e}")
    return success

def main():
    json_path = "scripts/scraper/unified_products_final.json"
    with open(json_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    # 1. 기존 스키마 구조에 맞게 데이터 변환
    products = []
    rates = []
    
    seen_codes = set()

    for item in raw_data:
        # 상품 코드 생성 (없으면 이름을 기반으로 생성)
        p_name = item['product_name']
        # 간단한 해시나 슬러그 형태로 코드 생성
        p_code = p_name.replace(" ", "_").replace("(", "").replace(")", "").replace(".", "_")[:50]
        
        if p_code not in seen_codes:
            products.append({
                "product_code": p_code,
                "company_name": item['company'],
                "display_name": p_name,
                "standard_code": p_code[:20], # 기본값
                "category": item['category']
            })
            seen_codes.add(p_code)

        # 요율 데이터 (연령별로 분리하여 적재)
        # 20, 30, 40, 50, 60세 데이터가 rates에 있음
        # 예: premium_M_40
        for key, val in item['rates'].items():
            if val > 0:
                parts = key.split("_")
                if len(parts) >= 3:
                    gender = parts[1]
                    age = int(parts[2])
                    
                    rates.append({
                        "id": str(uuid.uuid4()),
                        "product_code": p_code,
                        "gender": gender,
                        "age": age,
                        "job_class": 1,
                        "rate_data": {
                            "premium": val,
                            "coverages": item['coverages'],
                            "extras": item['extras']
                        }
                    })

    print(f"[*] 변환 완료! 마스터 상품 {len(products)}개 / 요율 데이터 {len(rates)}개")
    
    # 2. Supabase API로 최종 전송
    p_cnt = upsert_data("insurance_products", products)
    r_cnt = upsert_data("insurance_rates", rates)

    print(f"\n[*] 최종 완료 리포트:")
    print(f"  - 상품 정보: {p_cnt}개 성공 (Upsert)")
    print(f"  - 요율 정보: {r_cnt}개 성공 (Upsert)")

if __name__ == "__main__":
    main()
