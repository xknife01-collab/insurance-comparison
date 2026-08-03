import os
import re
from bs4 import BeautifulSoup

def deep_scan_heart_companies():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    heart_companies = set()
    keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막"]
    company_keywords = ["생명", "화재", "해상", "손해", "보험", "삼성", "현대", "DB", "KB", "한화", "메리츠", "흥국", "롯데", "농협", "하나", "AIA", "라이나", "동양", "신한", "교보", "미래", "KDB", "DGB"]

    print(f"Deep scanning {len(files)} files for heart insurance data...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # 바이너리 모드로 읽어서 키워드 존재 여부 확인
            with open(file_path, 'rb') as rb:
                raw_data = rb.read()
                
            # 심장 관련 키워드가 있는지 확인 (utf-8, cp949 인코딩 무관하게 바이트 검색)
            has_heart_data = False
            for kw in keywords:
                if kw.encode('cp949', errors='ignore') in raw_data or kw.encode('utf-8', errors='ignore') in raw_data:
                    has_heart_data = True
                    break
            
            if not has_heart_data:
                continue
                
            # 심장 데이터가 있는 파일이라면 보험사 추출 시도
            # 텍스트로 변환하여 검색
            content = raw_data.decode('cp949', errors='ignore')
            
            # HTML 테이블 구조가 있는 경우
            if "<table" in content.lower():
                soup = BeautifulSoup(content, 'html.parser')
                table = soup.find('table')
                if table:
                    rows = table.find_all('tr')
                    for row in rows[:10]: # 상단 10줄 내에 보험사명 존재
                        text = row.get_text(separator='|', strip=True)
                        for ck in company_keywords:
                            if ck in text:
                                # 키워드 주변 텍스트 추출
                                match = re.search(rf"{ck}[가-힣]*", text)
                                if match:
                                    comp = match.group()
                                    if len(comp) < 15:
                                        heart_companies.add(comp)
            else:
                # 바이너리/플레인 텍스트에서 보험사 키워드 직접 검색
                for ck in company_keywords:
                    matches = re.findall(rf"{ck}[가-힣]*", content)
                    for m in matches:
                        if any(x in m for x in ["생명", "화재", "해상", "손해", "보험"]):
                            if len(m) < 15:
                                heart_companies.add(m)
        except:
            pass

    with open("scratch/heart_company_list_final.txt", "w", encoding="utf-8") as out:
        out.write(f"Heart Insurance Specific Scan Results\n")
        out.write("-" * 50 + "\n")
        for c in sorted(list(heart_companies)):
            # 깨진 글자나 불필요한 수식어 제거
            c_clean = re.sub(r'[^\w\s]', '', c).strip()
            if len(c_clean) >= 2:
                out.write(f"- {c_clean}\n")
        out.write("-" * 50 + "\n")
        out.write(f"발견된 심장보험 취급사: {len(heart_companies)}개\n")

    print("Final heart company list saved to scratch/heart_company_list_final.txt")

if __name__ == "__main__":
    deep_scan_heart_companies()
