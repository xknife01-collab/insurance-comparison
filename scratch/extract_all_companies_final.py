import os
from bs4 import BeautifulSoup
import re

def extract_all_companies():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    all_raw_companies = set()
    
    print(f"Scanning {len(files)} files for unique company names...")
    
    # 한국의 주요 보험사 키워드 (필터링용)
    keywords = ["생명", "화재", "해상", "손해", "보험", "미래", "삼성", "현대", "교보", "한화", "흥국", "DB", "KB", "AIA", "라이나", "동양", "신한", "메리츠", "농협", "하나"]

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # 다양한 인코딩 시도
            content = ""
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    with open(file_path, 'r', encoding=enc, errors='ignore') as hf:
                        content = hf.read()
                    if "html" in content.lower():
                        break
                except:
                    continue
            
            if not content: continue
            
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if not table: continue
            
            for row in table.find_all('tr'):
                cols = row.find_all('td')
                if not cols: continue
                
                # 첫 번째 또는 두 번째 열에서 보험사명 추출 시도
                for col in cols[:2]:
                    text = col.get_text(strip=True)
                    # 보험사명으로 보일법한 것들 수집 (2글자 이상, 숫자 제외)
                    if len(text) >= 2 and not text.isdigit():
                        # 주요 키워드가 포함되어 있으면 보험사로 간주
                        if any(kw in text for kw in keywords):
                            all_raw_companies.add(text)
                            
        except Exception as e:
            pass

    with open("scratch/company_list.txt", "w", encoding="utf-8") as out:
        out.write(f"Scanning {len(files)} files for unique company names...\n\n")
        out.write("[전체 파일에서 추출된 보험사/브랜드 관련 텍스트]\n")
        out.write("-" * 50 + "\n")
        clean_list = sorted([c for c in all_raw_companies if len(c) < 30])
        for c in clean_list:
            out.write(f"- {c}\n")
        out.write("-" * 50 + "\n")
        out.write(f"총 {len(clean_list)}개의 관련 명칭이 발견되었습니다.\n")
    
    print(f"Results saved to scratch/company_list.txt")

if __name__ == "__main__":
    extract_all_companies()
