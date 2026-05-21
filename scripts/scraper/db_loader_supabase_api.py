import json
import requests
import os
from dotenv import load_dotenv

# .env.local에서 정보 로드
load_dotenv(".env.local")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not URL or not KEY:
    # .env.local이 아니면 .env 확인
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
    
    # 50개씩 나눠서 전송
    batch_size = 50
    success_count = 0
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i : i + batch_size]
        try:
            response = requests.post(endpoint, headers=headers, json=batch)
            if response.status_code in [200, 201, 204]:
                success_count += len(batch)
                print(f"  [+] {table}: {success_count}개 완료...")
            else:
                print(f"  [!] {table} 오류 ({response.status_code}): {response.text}")
        except Exception as e:
            print(f"  [!] {table} 전송 실패: {e}")
            
    return success_count

def main():
    json_path = "scripts/scraper/unified_products_final.json"
    if not os.path.exists(json_path):
        print("JSON 파일이 없습니다.")
        return
        
    with open(json_path, "r", encoding="utf-8") as f:
        all_data = json.load(f)
        
    print(f"[*] 총 {len(all_data)}개 상품 데이터 API 전송 시작...")
    
    # 1. Products 맵핑
    products_to_send = []
    rates_to_send = []
    
    for item in all_data:
        products_to_send.append({
            "company_name": item['company'],
            "product_name": item['product_name'],
            "category": item['category']
        })
        
        rates_to_send.append({
            "product_name": item['product_name'],
            "rates": item['rates'],
            "coverages": item['coverages'],
            "extras": item['extras']
        })
    
    # 전송 실행
    p_count = upsert_data("insurance_products", products_to_send)
    r_count = upsert_data("insurance_rates", rates_to_send)
    
    print(f"\n[*] 최종 리포트:")
    print(f"  - 마스터 상품: {p_count}개 동기화")
    print(f"  - 상세 요율/보장: {r_count}개 동기화")

if __name__ == "__main__":
    main()
