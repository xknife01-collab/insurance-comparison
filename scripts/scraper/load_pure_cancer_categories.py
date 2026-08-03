import os
import pandas as pd
import requests
from dotenv import load_dotenv

# 설정
env_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    # .env.local도 시도
    load_dotenv(r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local')
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def load_categorized_cancer():
    cancer_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer'
    files = {
        "비갱신암": 'cancer_non_renewable.csv',
        "갱신암": 'cancer_renewable.csv',
        "표적항암": 'cancer_targeted.csv'
    }

    # 1. 기존 데이터 삭제 (중요: 새로운 분류로 대체하기 위함)
    print("[*] 기존 암보험 데이터 삭제 중...")
    url = f"{SUPABASE_URL}/rest/v1"
    requests.delete(f"{url}/insurance_cancer_rates?age=gt.0", headers=HEADERS)
    requests.delete(f"{url}/insurance_cancer_products?company_name=neq.null", headers=HEADERS)

    for category_name, file_name in files.items():
        file_path = os.path.join(cancer_dir, file_name)
        if not os.path.exists(file_path):
            print(f"[!] 파일을 찾을 수 없음: {file_name}")
            continue

        print(f"[*] {category_name} 데이터 적재 시작: {file_name}")
        df = pd.read_csv(file_path, encoding='utf-8-sig', on_bad_lines='skip')
        
        # 상품별로 통합 (기존 로직 유지)
        packages = {}
        for _, row in df.iterrows():
            p_name = str(row['상품명'])[:250]
            if p_name not in packages:
                packages[p_name] = {
                    "company_name": str(row['보험회사'])[:95],
                    "product_name": p_name,
                    "male_total": 0,
                    "female_total": 0,
                    "benefits": set()
                }
            
            # 보험료 추출 및 합산
            def extract_price(val):
                if pd.isna(val): return 0
                match = "".join(filter(str.isdigit, str(val)))
                return int(match) if match else 0

            packages[p_name]["male_total"] += extract_price(row['기준보험료'])
            packages[p_name]["female_total"] += extract_price(row['가입보험료'])
            packages[p_name]["benefits"].add(str(row['담보명(급부명)']))

        products_batch = []
        rates_batch = []

        for p_name, pkg in packages.items():
            # 월 보험료로 환산 (너무 크면 12로 나눔)
            m_total = pkg['male_total']
            f_total = pkg['female_total']
            if m_total > 150000: m_total //= 12
            if f_total > 150000: f_total //= 12
            
            # 유효성 검사
            if m_total < 5000 or m_total > 500000: continue

            products_batch.append({
                "company_name": pkg['company_name'],
                "product_name": p_name,
                "category": category_name  # 비갱신암, 갱신암, 표적항암으로 적재!
            })
            
            common_benefit = f"{len(pkg['benefits'])}개 담보 합산"
            rates_batch.append({
                "product_name": p_name, "gender": "M", "age": 40, "premium": m_total,
                "benefit_name": "종합 보장 패키지", "benefit_amount": common_benefit
            })
            rates_batch.append({
                "product_name": p_name, "gender": "F", "age": 40, "premium": f_total,
                "benefit_name": "종합 보장 패키지", "benefit_amount": common_benefit
            })

        # DB 업로드
        if products_batch:
            requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_products", headers=HEADERS, json=products_batch)
            for i in range(0, len(rates_batch), 100):
                requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates", headers=HEADERS, json=rates_batch[i : i + 100])
            print(f"[+] {category_name} {len(products_batch)}개 상품 적재 완료")

if __name__ == "__main__":
    load_categorized_cancer()
