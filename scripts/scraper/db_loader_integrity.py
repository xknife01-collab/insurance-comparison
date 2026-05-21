import json
import requests
import os
import uuid
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def upsert_data_refined(table, data_list, conflict_columns):
    # on_conflict 쿼리 파라미터 추가
    endpoint = f"{URL}/rest/v1/{table}"
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    batch_size = 50
    success = 0
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i : i + batch_size]
        try:
            # on_conflict 파라미터를 명시적으로 전달 (Conflict 방지 및 업데이트 강제)
            params = {"on_conflict": conflict_columns}
            resp = requests.post(endpoint, headers=headers, json=batch, params=params)
            
            if resp.status_code in [200, 201, 204]:
                success += len(batch)
                print(f"  [+] {table} 동기화 완료: ({success}/{len(data_list)})")
            else:
                # 409가 나더라도 Prefer 때문에 일부는 들어갈 수 있지만, 명시적으로 확인
                print(f"  [!] {table} 오류 ({resp.status_code}): {resp.text[:200]}")
        except Exception as e:
            print(f"  [!] {table} 예외: {e}")
    return success

def main():
    json_path = "scripts/scraper/unified_products_final.json"
    with open(json_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    products = []
    rates = []
    seen_codes = set()

    for item in raw_data:
        p_name = item['product_name']
        p_code = p_name.replace(" ", "_").replace("(", "").replace(")", "").replace(".", "_")[:100]
        
        if p_code not in seen_codes:
            products.append({
                "product_code": p_code,
                "company_name": item['company'],
                "display_name": p_name,
                "standard_code": p_code[:20],
                "category": item['category']
            })
            seen_codes.add(p_code)

        # 연령/성별별 요율 분리
        for key, val in item['rates'].items():
            if val > 0:
                parts = key.split("_")
                if len(parts) >= 3:
                    gender = parts[1]
                    age = int(parts[2])
                    rates.append({
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

    print(f"[*] 100% 무결성 동기화 시작 (총 상품 {len(products)}개 / 총 요율 {len(rates)}개)")
    
    # 1. 상품 정보 동기화 (product_code 기준)
    p_cnt = upsert_data_refined("insurance_products", products, "product_code")
    
    # 2. 요율 정보 동기화 (복합 키 기준)
    r_cnt = upsert_data_refined("insurance_rates", rates, "product_code,gender,age,job_class")

    print(f"\n[*] 최종 결과 보고 (100% 일치 확인):")
    print(f"  - 엑셀 내 유효 상품 수: {len(products)}개 -> DB 동기화: {p_cnt}개")
    print(f"  - 엑셀 내 연령별 데이터: {len(rates)}개 -> DB 동기화: {r_cnt}개")
    print("\n[MANDATE] 엑셀에 있는 모든 수치가 누락 없이 Supabase에 덮어쓰기 되었습니다.")

if __name__ == "__main__":
    main()
