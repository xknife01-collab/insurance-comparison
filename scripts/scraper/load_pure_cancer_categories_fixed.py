import os
import pandas as pd
import requests
from dotenv import load_dotenv

# 설정
env_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def load_categorized_cancer_fixed():
    cancer_dir = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer'
    files = {
        "비갱신암": 'cancer_non_renewable.csv',
        "갱신암": 'cancer_renewable.csv',
        "표적항암": 'cancer_targeted.csv'
    }

    print("[*] 기존 데이터 삭제 및 고가 상품 오류 수정 적재 시작...")
    url = f"{SUPABASE_URL}/rest/v1"
    requests.delete(f"{url}/insurance_cancer_rates?age=gt.0", headers=HEADERS)
    requests.delete(f"{url}/insurance_cancer_products?company_name=neq.null", headers=HEADERS)

    for category_name, file_name in files.items():
        file_path = os.path.join(cancer_dir, file_name)
        if not os.path.exists(file_path): continue

        df = pd.read_csv(file_path, encoding='utf-8-sig', on_bad_lines='skip')
        packages = {}
        for _, row in df.iterrows():
            p_name = str(row['상품명'])[:250]
            if p_name not in packages:
                packages[p_name] = {
                    "company_name": str(row['보험회사'])[:95],
                    "product_name": p_name,
                    "male_total": 0, "female_total": 0, "benefits": set()
                }
            
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
            m_total = pkg['male_total']
            f_total = pkg['female_total']
            
            # --- 고가 상품 오류 수정 로직 (강화됨) ---
            # 10만원 이상이면 연납일 확률이 99%입니다. (암보험 기준)
            # 특히 20만원~50만원 사이는 전형적인 연납 총액입니다.
            if m_total > 100000: m_total //= 12
            if f_total > 100000: f_total //= 12
            
            # 만약 나눈 후에도 너무 크면 (예: 100만원 넘는 연납) 한번 더 체크
            if m_total > 150000: m_total //= 12
            if f_total > 150000: f_total //= 12
            # ---------------------------------------

            if m_total < 5000 or m_total > 200000: continue # 20만원 초과는 사실상 비정상 데이터로 간주

            products_batch.append({
                "company_name": pkg['company_name'], "product_name": p_name, "category": category_name
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

        if products_batch:
            requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_products", headers=HEADERS, json=products_batch)
            for i in range(0, len(rates_batch), 100):
                requests.post(f"{SUPABASE_URL}/rest/v1/insurance_cancer_rates", headers=HEADERS, json=rates_batch[i : i + 100])
            print(f"[+] {category_name} {len(products_batch)}개 상품 정상 적재 완료")

if __name__ == "__main__":
    load_categorized_cancer_fixed()
