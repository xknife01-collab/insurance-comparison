import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer\extracted_data.csv'

def find_product():
    encodings = ['cp949', 'euc-kr', 'utf-8', 'utf-16']
    for enc in encodings:
        try:
            print(f"[*] Trying encoding: {enc}")
            df = pd.read_csv(csv_path, encoding=enc, nrows=5000)
            
            # 상품명에 '2501'이 포함된 행 찾기
            matches = df[df['상품명'].str.contains('2501', na=False, case=False)]
            if not matches.empty:
                print(f"[!] Found {len(matches)} matches with encoding {enc}")
                for idx, row in matches.drop_duplicates(subset=['상품명']).iterrows():
                    print(f"회사: {row['보험회사']} | 상품명: {row['상품명']} | 카테고리: {row.get('갱신구분', 'N/A')}")
                return
        except Exception as e:
            print(f"[-] Failed with {enc}: {e}")

if __name__ == "__main__":
    find_product()
