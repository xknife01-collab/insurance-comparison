import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def extract_heart_broken_restore():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    master_data = []
    # 깨진 패턴 기반 키워드 (첫 글자가 인 경우 대비)
    broken_keywords = [
        r'.장', r'.혈', r'.혈관', r'.정맥', r'.부전', r'.판막', 
        "심장", "허혈", "심혈관", "부정맥", "심부전", "심판막"
    ]
    
    print(f"Broken Pattern Restoration Scanning {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            if "<table" not in content.lower(): continue
            
            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
                row_text = " ".join(cols)
                
                # 깨진 패턴이나 정상 키워드가 포함된 경우
                is_heart = False
                for pattern in broken_keywords:
                    if re.search(pattern, row_text):
                        # 단순히 '장'이나 '혈'이 들어간 경우는 제외하기 위해 주변 문맥 확인
                        if any(x in row_text for x in ["진단", "수술", "치료", "보장", "급여"]):
                            is_heart = True
                            break
                
                if is_heart:
                    master_data.append({
                        "raw": "|".join(cols),
                        "source": f
                    })
                    
        except Exception as e:
            pass

    # 데이터 정제 및 최종 엑셀 생성
    final_rows = []
    for item in master_data:
        parts = item['raw'].split('|')
        if len(parts) < 5: continue
        
        # 보험사명 추출 (깨진 글자 보정)
        company = parts[0]
        company = company.replace('', '') # 깨진 문자 제거
        
        # 상품명, 보장명 등
        product = parts[1] if len(parts) > 1 else ""
        coverage = parts[2] if len(parts) > 2 else ""
        
        # 보험료 추출
        nums = re.findall(r'\d+', item['raw'].replace(',', ''))
        nums = [int(n) for n in nums if 5000 < int(n) < 1000000]
        
        prem_m = nums[0] if len(nums) >= 1 else 0
        prem_f = nums[1] if len(nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)

        final_rows.append({
            "보험사": company if company else "미확인",
            "상품명": product,
            "카테고리": "심장질환",
            "보장명": coverage,
            "지급사유": parts[3] if len(parts) > 3 else "",
            "가입금액": parts[4] if len(parts) > 4 else "",
            "남자보험료": prem_m,
            "여자보험료": prem_f,
            "갱신유형": "갱신형", # 기본값
            "출처파일명": item['source']
        })

    df = pd.DataFrame(final_rows)
    if not df.empty:
        df.drop_duplicates(inplace=True)
        df.to_csv("heart_master_restored.csv", index=False, encoding='utf-8-sig')
        print(f"Extraction complete. {len(df)} records restored and saved.")
    else:
        print("No matches even with broken patterns.")

if __name__ == "__main__":
    extract_heart_broken_restore()
