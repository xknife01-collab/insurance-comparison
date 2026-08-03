import os
import re
from bs4 import BeautifulSoup

def extract_heart_companies_from_html():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    
    heart_data = [] # (Company, Product, Category)
    unique_companies = set()
    
    # 심장 관련 키워드
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막", "조율기", "스텐트"]
    
    print(f"Analyzing {len(files)} files for HTML-based heart insurance data...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # HTML 여부 확인
            with open(file_path, 'rb') as rb:
                prefix = rb.read(2048).lower()
                if b'<table' not in prefix and b'<html' not in prefix:
                    continue
            
            # 인코딩 처리하며 읽기
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
                
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if not table: continue
            
            rows = table.find_all('tr')
            for row in rows:
                text = row.get_text(separator='|', strip=True)
                # 줄 전체 텍스트에 심장 키워드가 있는지 확인
                if any(kw in text for kw in heart_keywords):
                    # 해당 줄에서 보험사명과 상품명 추출 시도
                    # 보통 한 줄에 [회사|상품|담보|...] 순으로 배치됨
                    parts = [p.strip() for p in text.split('|') if p.strip()]
                    if len(parts) >= 2:
                        # 첫 번째 요소가 회사명일 확률이 높음 (삼성, 현대, DB 등)
                        company = parts[0]
                        # 두 번째 요소가 상품명일 확률이 높음
                        product = parts[1]
                        
                        # 회사명이 너무 길거나(상품명 오인) 너무 짧으면 제외
                        if 2 <= len(company) <= 10:
                            unique_companies.add(company)
                            heart_data.append((company, product))
                            
        except Exception as e:
            pass

    # 결과 정리
    print("\n[발견된 심장질환 관련 보험사 목록 (HTML 파일 기준)]")
    print("-" * 50)
    sorted_companies = sorted(list(unique_companies))
    for c in sorted_companies:
        print(f"- {c}")
    print("-" * 50)
    print(f"총 {len(sorted_companies)}개의 보험사가 심장 관련 상품을 보유하고 있습니다.")
    
    # 상세 데이터 확인용 출력 (일부)
    if heart_data:
        print("\n[추출된 샘플 데이터 (상위 10개)]")
        for i, (c, p) in enumerate(heart_data[:10]):
            print(f"{i+1}. [{c}] {p}")

if __name__ == "__main__":
    extract_heart_companies_from_html()
