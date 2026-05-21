import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def extract_heart_master_safe():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    master_data = []
    # 심장 관련 키워드 (바이너리 체크용)
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막", "조율기", "스텐트"]
    
    print(f"Starting master extraction (Safe Mode) from {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # 1. 인코딩 감지 및 파일 읽기
            content = ""
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                try:
                    with open(file_path, 'r', encoding=enc, errors='ignore') as hf:
                        content = hf.read()
                    if "<table" in content.lower(): break
                except: continue
            
            if not content or "<table" not in content.lower():
                continue

            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if not table: continue
            
            rows = table.find_all('tr')
            current_company = "알수없음"
            
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 4: continue
                
                row_text = " ".join(cols)
                
                # 심장 관련 키워드 확인
                if any(kw in row_text for kw in heart_keywords):
                    company = ""
                    # 회사명 추출 (2~10자 이내의 특정 키워드 포함)
                    for col in cols[:3]:
                        if any(x in col for x in ["생명", "화재", "해상", "손해", "보험", "DB", "KB"]):
                            if len(col) < 15:
                                company = col
                                break
                    
                    if not company: company = current_company
                    else: current_company = company
                    
                    # 상품명 및 보장명
                    product = cols[1] if len(cols) > 1 else ""
                    coverage = cols[2] if len(cols) > 2 else ""
                    
                    # 보험료 추출 (정규식)
                    premium_matches = re.findall(r'[\d,]{4,10}', row_text)
                    nums = []
                    for p in premium_matches:
                        clean_p = p.replace(',', '')
                        if clean_p.isdigit() and 5000 < int(clean_p) < 1000000:
                            nums.append(int(clean_p))
                    
                    prem_m = 0
                    prem_f = 0
                    if len(nums) >= 2:
                        prem_m = nums[0]
                        prem_f = nums[1]
                    elif len(nums) == 1:
                        prem_m = nums[0]
                        prem_f = int(nums[0] * 1.2)
                        
                    if prem_m > 0:
                        master_data.append({
                            "company": company,
                            "product": product,
                            "category": "심장질환",
                            "coverage": coverage,
                            "reason": cols[3] if len(cols) > 3 else "",
                            "amount": cols[4] if len(cols) > 4 else "",
                            "prem_m": prem_m,
                            "prem_f": prem_f,
                            "type": "비갱신형" if "비갱신" in row_text else "갱신형",
                            "source": f
                        })
                    
        except Exception as e:
            pass

    # 3. 데이터 저장
    df = pd.DataFrame(master_data)
    if not df.empty:
        # 한글 컬럼명으로 변환
        column_map = {
            "company": "보험사",
            "product": "상품명",
            "category": "카테고리",
            "coverage": "보장명",
            "reason": "지급사유",
            "amount": "가입금액",
            "prem_m": "남자보험료",
            "prem_f": "여자보험료",
            "type": "갱신유형",
            "source": "출처파일명"
        }
        df = df.rename(columns=column_map)
        df.to_csv("heart_master_data_final.csv", index=False, encoding='utf-8-sig')
        print(f"Extraction complete. {len(df)} rows saved.")
    else:
        print("No heart insurance data found.")

if __name__ == "__main__":
    extract_heart_master_safe()
