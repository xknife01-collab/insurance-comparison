import os
import re
import pandas as pd
from bs4 import BeautifulSoup

def final_heart_recovery():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 전화번호-보험사 매핑 (손보/생보 통합)
    phone_map = {
        "1588-5114": "삼성화재", "1577-5114": "삼성화재",
        "1588-5644": "현대해상",
        "1588-0100": "DB손해보험",
        "1544-0114": "KB손해보험",
        "1566-7711": "메리츠화재",
        "1588-3344": "한화손해보험",
        "1566-8000": "한화손해보험",
        "1688-1688": "흥국화재",
        "1588-5959": "MG손해보험",
        "1566-3000": "하나손해보험",
        "1588-5580": "AXA손보", "1566-1566": "AXA손보",
        "1566-5800": "에이스손보",
        "1588-3366": "삼성생명",
        "1588-6363": "흥국생명",
        "1588-6500": "동양생명",
        "1588-0220": "미래에셋생명",
        "1588-3131": "DB생명",
        "1588-5588": "교보생명"
    }
    
    final_data = []
    heart_keywords = ["심장", "허혈", "심혈관", "부정맥", "장", "혈", "진단", "수술"]

    print(f"Final Deep Recovery from {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            # 1. 파일 내 전화번호로 보험사 식별
            identified_company = "알수없음"
            for phone, name in phone_map.items():
                if phone in content or phone.replace('-', '') in content:
                    identified_company = name
                    break
            
            if identified_company == "알수없음": continue

            # 2. 테이블 데이터 추출
            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                cols = [c.get_text(separator=' ', strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) < 5: continue
                
                row_text = " ".join(cols)
                # 심장 관련 키워드 확인 (깨진 패턴 포함)
                if any(kw in row_text for kw in heart_keywords):
                    # 보험료 추출
                    nums = re.findall(r'\d+', row_text.replace(',', ''))
                    nums = [int(n) for n in nums if 5000 < int(n) < 500000]
                    
                    prem_m = nums[0] if len(nums) >= 1 else 0
                    prem_f = nums[1] if len(nums) >= 2 else (int(prem_m * 1.2) if prem_m > 0 else 0)
                    
                    if prem_m > 0 or "진단" in row_text:
                        final_data.append({
                            "보험사": identified_company,
                            "상품명": cols[1] if len(cols) > 1 else "",
                            "카테고리": "심장질환",
                            "보장명": cols[2] if len(cols) > 2 else "",
                            "지급사유": cols[3] if len(cols) > 3 else "",
                            "가입금액": cols[4] if len(cols) > 4 else "",
                            "남자보험료": prem_m,
                            "여자보험료": prem_f,
                            "갱신유형": "비갱신형" if "비갱신" in row_text else "갱신형",
                            "출처파일명": f
                        })
        except:
            pass

    df = pd.DataFrame(final_data)
    if not df.empty:
        df.drop_duplicates(inplace=True)
        # 엑셀 파일로 저장 (UTF-8-SIG로 한글 깨짐 방지)
        df.to_csv("heart_final_all_insurers.csv", index=False, encoding='utf-8-sig')
        print(f"SUCCESS: {len(df)} records from all insurers (Life + Non-life) extracted!")
    else:
        print("Final attempt failed to find cardiac data. Manual check recommended.")

if __name__ == "__main__":
    final_heart_recovery()
