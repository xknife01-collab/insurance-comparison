import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def extract_heart_liberal():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    master_data = []
    # 심장 관련 키워드 (한글 직접 검색 실패 대비 바이트 패턴 포함 고려)
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "심부전", "심판막", "심근", "관상"]
    
    print(f"Liberal master extraction from {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            # 인코딩 순환
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
            current_company = "알수없음"
            
            for row in soup.find_all('tr'):
                cells = row.find_all(['td', 'th'])
                cols = [c.get_text(separator=' ', strip=True) for c in cells]
                if not cols: continue
                
                row_text = " ".join(cols)
                
                # 심장 관련 데이터인지 확인
                if any(kw in row_text for kw in heart_keywords):
                    # 회사명 추출 로직 보강
                    company = ""
                    for c_val in cols[:4]:
                        if any(x in c_val for x in ["생명", "화재", "해상", "손해", "보험", "DB", "KB"]):
                            if 2 <= len(c_val) <= 12:
                                company = c_val
                                break
                    
                    if company: current_company = company
                    
                    # 모든 열 데이터를 저장 (데이터 유실 방지)
                    master_data.append({
                        "company": current_company,
                        "raw_row": "|".join(cols),
                        "source": f
                    })
                    
        except Exception as e:
            pass

    # 3. 데이터 가공 및 엑셀 포맷팅
    final_rows = []
    for item in master_data:
        parts = item['raw_row'].split('|')
        # 열 개수가 부족하면 패딩
        while len(parts) < 10: parts.append("")
        
        # 보험료 숫자 추출
        nums = []
        for p in parts:
            clean = re.sub(r'[^\d]', '', p)
            if clean and 5000 < int(clean) < 1000000:
                nums.append(int(clean))
        
        prem_m = nums[0] if len(nums) >= 1 else 0
        prem_f = nums[1] if len(nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)

        final_rows.append({
            "보험사": item['company'],
            "상품명": parts[1] if len(parts) > 1 else "",
            "카테고리": "심장질환",
            "보장명": parts[2] if len(parts) > 2 else "",
            "지급사유": parts[3] if len(parts) > 3 else "",
            "가입금액": parts[4] if len(parts) > 4 else "",
            "남자보험료": prem_m,
            "여자보험료": prem_f,
            "갱신유형": "비갱신형" if "비갱신" in item['raw_row'] else "갱신형",
            "출처파일명": item['source']
        })

    df = pd.DataFrame(final_rows)
    if not df.empty:
        # 중복 제거 및 저장
        df.drop_duplicates(inplace=True)
        df.to_csv("heart_master_data_v3.csv", index=False, encoding='utf-8-sig')
        print(f"Extraction complete. {len(df)} unique records saved.")
    else:
        print("Still no data found. Checking raw content...")

if __name__ == "__main__":
    extract_heart_liberal()
