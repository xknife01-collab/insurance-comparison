import os
import re
import pandas as pd

def extract_by_phone_numbers():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 보험사별 전화번호 매핑
    phones = {
        "1588-5114": "삼성화재",
        "1588-5644": "현대해상",
        "1588-0100": "DB손해보험",
        "1544-0114": "KB손해보험",
        "1566-7711": "메리츠화재",
        "1588-3344": "한화손해보험",
        "1588-3131": "DB생명",
        "1588-0220": "미래에셋생명",
        "1588-3366": "삼성생명",
        "1588-5588": "교보생명"
    }
    
    master_data = []
    print(f"Scanning for insurers using phone numbers in {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            for phone, company_name in phones.items():
                if phone in content:
                    # 해당 전화번호가 있는 행(또는 주변 텍스트) 추출
                    # 심장 관련 키워드도 함께 체크 (깨진 패턴 고려)
                    if any(kw in content for kw in ["심장", "허혈", "심혈관", "장", "혈"]):
                        master_data.append({
                            "보험사": company_name,
                            "파일명": f,
                            "전화번호": phone
                        })
        except:
            pass

    df = pd.DataFrame(master_data)
    if not df.empty:
        df.drop_duplicates(inplace=True)
        df.to_csv("heart_files_by_phone.csv", index=False, encoding='utf-8-sig')
        print(f"Found {len(df)} insurer matches via phone numbers.")
        print(df.head(20))
    else:
        print("No matches found via phone numbers.")

if __name__ == "__main__":
    extract_by_phone_numbers()
