import os
import pandas as pd
import requests
from dotenv import load_dotenv

# 설정
base_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main'
load_dotenv(os.path.join(base_path, '.env'))
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    load_dotenv(os.path.join(base_path, '.env.local'))
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def strict_load_cancer():
    raw_path = os.path.join(base_path, r'insurance_data\0_popular\cancer\extracted_data.csv')
    df = pd.read_csv(raw_path, encoding='utf-8-sig')

    print(f"[*] 총 {len(df)}개 원본 데이터 분석 중...")

    # 1. 유형별 분류 (엄격한 규칙 적용)
    def classify(row):
        name = str(row['상품명'])
        category_raw = str(row.get('갱신구분', ''))
        
        # 1. 표적항암 우선 (가장 최신 상품군)
        if any(kw in name for kw in ['표적', '항암', '방사선', '치료비']):
            return '표적항암형'
            
        # 2. 비갱신형 명시
        if '비갱신' in name or '세만기' in name:
            return '비갱신형'
            
        # 3. 갱신형 명시 및 패턴 분석
        # - 상품명이나 갱신구분에 '갱신'이 있는 경우
        # - '년만기'라는 표현이 있는 경우 (보통 갱신형)
        # - 최신 상품 코드(2410, 2501, 2601 등)가 포함된 경우 (특히 DB, 삼성 등은 갱신형이 많음)
        # - 보험회사 이름이 'DB'이면서 'New간편'이 들어가는 경우
        if ('갱신' in name or '갱신' in category_raw or '년만기' in name or 
            any(code in name for code in ['240', '241', '250', '251', '260']) or
            ('DB' in str(row['보험회사']) and 'New' in name)):
            return '갱신형'
            
        # 4. 기본값 (단어 분석을 통한 추론)
        # '세'가 없고 '년'만 있는 경우 갱신형일 확률이 매우 높음
        if '년' in name and '세' not in name:
            return '갱신형'
            
        return '비갱신형'

    df['final_category'] = df.apply(classify, axis=1)

    url = f"{SUPABASE_URL}/rest/v1"
    
    # DB 초기화
    requests.delete(f"{url}/insurance_cancer_rates?age=gt.0", headers=HEADERS)
    requests.delete(f"{url}/insurance_cancer_products?company_name=neq.null", headers=HEADERS)

    categories = ['비갱신형', '갱신형', '표적항암형']
    
    for cat in categories:
        sub_df = df[df['final_category'] == cat]
        packages = {}
        
        for _, row in sub_df.iterrows():
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
            
            # 연납(고액) 보정
            if m_total > 150000: m_total //= 12
            if f_total > 150000: f_total //= 12
            
            # 유효성 필터
            if m_total < 3000 or m_total > 200000: continue

            products_batch.append({
                "company_name": pkg['company_name'], "product_name": p_name, "category": cat
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
            print(f"[+] {cat}: {len(products_batch)}개 상품 엄격 분류 및 적재 완료")

if __name__ == "__main__":
    strict_load_cancer()
