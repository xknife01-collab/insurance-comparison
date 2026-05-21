import os
from bs4 import BeautifulSoup

def extract_comprehensive_companies():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    found_companies = set()
    
    # 더 넓은 키워드 범위
    keywords = ["삼성", "현대", "DB", "KB", "한화", "메리츠", "흥국", "롯데", "농협", "하나", "AIA", "라이나", "동양", "신한", "교보", "미래", "KDB", "DGB"]

    for f in files:
        file_path = os.path.join(path, f)
        # HTML 구조 무시하고 텍스트에서 키워드 찾기 (가장 확실함)
        try:
            content = ""
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                try:
                    with open(file_path, 'r', encoding=enc, errors='ignore') as hf:
                        content = hf.read()
                    if len(content) > 100: break
                except:
                    continue
            
            if not content: continue
            
            # 텍스트 전체에서 키워드가 포함된 단어(보험사명) 추출
            # 보통 "XX생명", "XX화재", "XX해상" 형태
            for kw in keywords:
                # 키워드 뒤에 생명/화재/해상/손해/보험 등이 붙는 패턴 찾기
                pattern = rf"{kw}[가-힣]*"
                matches = re.findall(pattern, content)
                for m in matches:
                    if len(m) >= 2:
                        # 너무 긴 문장은 제외 (보통 상품명임)
                        if "보험" in m or "생명" in m or "화재" in m or "해상" in m or "손해" in m:
                            if len(m) < 15:
                                found_companies.add(m)
                        else:
                            # 키워드만 있는 경우 (삼성, 현대 등)
                            found_companies.add(m)
                            
        except Exception as e:
            pass

    import re # re가 위에서 안불려졌을수도 있음
    
    with open("scratch/company_list_v2.txt", "w", encoding="utf-8") as out:
        out.write(f"Comprehensive Scan Results ({len(files)} files)\n")
        out.write("-" * 50 + "\n")
        # 정제된 리스트 (명백한 보험사 위주)
        sorted_list = sorted(list(found_companies))
        for c in sorted_list:
            # 특수 기호 제거 및 중복 제거
            c_clean = re.sub(r'[^\w\s]', '', c).strip()
            if len(c_clean) >= 2:
                out.write(f"- {c_clean}\n")
        out.write("-" * 50 + "\n")
        
    print("Comprehensive list saved to scratch/company_list_v2.txt")

if __name__ == "__main__":
    import re
    extract_comprehensive_companies()
