import os
from bs4 import BeautifulSoup
import re

def extract_heart_companies_advanced():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    unique_companies = set()
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막"]
    # 보험사 명칭 패턴 (2~6글자 한글 뒤에 생명/화재/해상/손해/보험이 붙거나, DB, KB 등 영어 조합)
    company_patterns = [
        r'[가-힣]{2,5}생명', r'[가-힣]{2,5}화재', r'[가-힣]{2,5}해상', 
        r'[가-힣]{2,5}손해', r'DB[가-힣]+', r'KB[가-힣]+', 
        r'AIA[가-힣]+', r'KDB[가-힣]+', r'DGB[가-힣]+', r'MG[가-힣]+'
    ]

    print(f"Advanced scanning {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            if "<table" not in content.lower(): continue
            
            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                row_text = row.get_text(separator=' ', strip=True)
                
                # 심장 관련 키워드가 있는 줄만 분석
                if any(kw in row_text for kw in heart_keywords):
                    # 해당 줄의 모든 단어를 검사하여 보험사 패턴에 맞는 것 추출
                    words = row_text.split()
                    for word in words:
                        for pattern in company_patterns:
                            match = re.search(pattern, word)
                            if match:
                                company = match.group()
                                # 불필요한 기호 제거
                                company = re.sub(r'[^\w]', '', company)
                                unique_companies.add(company)
        except:
            pass

    print("\n[심장보험 데이터에서 발견된 모든 보험사 리스트]")
    print("-" * 50)
    for c in sorted(list(unique_companies)):
        print(f"- {c}")
    print("-" * 50)
    print(f"총 {len(unique_companies)}개 보험사가 추출되었습니다.")

if __name__ == "__main__":
    extract_heart_companies_advanced()
