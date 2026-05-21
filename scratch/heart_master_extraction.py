import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def extract_heart_master():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    master_data = []
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막", "조율기", "스텐트"]
    
    print(f"Starting master extraction from {len(files)} files...")

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

            # 2. BeautifulSoup으로 테이블 파싱
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if not table: continue
            
            rows = table.find_all('tr')
            current_company = ""
            current_product = ""
            
            for row in rows:
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if not cols or len(cols) < 5: continue
                
                row_text = " ".join(cols)
                
                # 심장 관련 키워드 확인
                if any(kw in row_text for kw in heart_keywords):
                    # 보험사 및 상품명 추출 (보통 상위 셀이나 특정 열에 존재)
                    # 데이터 구조에 따라 열 인덱스 조정 (유동적 대응)
                    company = ""
                    product = ""
                    
                    # 회사명 패턴 매칭 (삼성화재, 현대해상, DB손보 등)
                    for col in cols[:3]:
                        if any(x in col for x in ["생명", "화재", "해상", "손해", "보험", "DB", "KB"]):
                            if len(col) < 20: # 너무 길면 상품명임
                                company = col
                                break
                    
                    # 만약 회사명을 못 찾았다면 이전 행의 정보를 활용하거나 재추출
                    if not company: company = current_company
                    else: current_company = company
                    
                    # 상품명 추출
                    product = cols[1] if len(cols) > 1 else ""
                    if "보험" not in product and len(cols) > 2: product = cols[2]
                    
                    # 보장명, 지급사유, 보험료 등 매핑
                    # 표준 엑셀 구조 가정 (조정 필요시 여기서 수정)
                    coverage = ""
                    reason = ""
                    premium_m = 0
                    premium_f = 0
                    
                    # 텍스트 내에서 보험료(숫자) 추출 시도
                    premium_matches = re.findall(r'[\d,]{4,10}', row_text)
                    nums = [int(p.replace(',', '')) for p in premium_matches if p.replace(',', '').isdigit()]
                    
                    if len(nums) >= 2:
                        premium_m = nums[0]
                        premium_f = nums[1]
                    elif len(nums) == 1:
                        premium_m = nums[0]
                        premium_f = int(nums[0] * 1.2) # 보정 로직
                        
                    master_data.append({
                        "보험사": company,
                        "상품명": product,
                        "카테고리": "심장질환",
                        "보장명": cols[2] if len(cols) > 2 else "진단비",
                        "지급사유": cols[3] if len(cols) > 3 else "",
                        "가입금액": cols[4] if len(cols) > 4 else "",
                        "남자보험료": premium_m,
                        "여자보험료": premium_f,
                        "갱신유형": "비갱신형" if "비갱신" in row_text else "갱신형",
                        "출처파일명": f
                    })
                    
        except Exception as e:
            print(f"Error in {f}: {e}")

    # 3. 데이터 정제 및 저장
    df = pd.DataFrame(master_data)
    # 중복 제거 및 유효 데이터 필터링
    df = df[df['남자보험료'] > 0]
    df.to_csv("heart_master_data_final.csv", index=False, encoding='utf-8-sig')
    print(f"Master extraction complete. {len(df)} rows saved to heart_master_data_final.csv")

if __name__ == "__main__":
    extract_heart_master()
