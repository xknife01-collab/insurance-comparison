import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer\extracted_data.csv'

def find_product():
    try:
        # 7MB면 전체 로딩 가능
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        # 키워드 검색
        keywords = ['DB', '간편암', '2501', 'New']
        for kw in keywords:
            print(f"[*] Searching for keyword: {kw}")
            matches = df[df['상품명'].str.contains(kw, na=False, case=False)]
            if not matches.empty:
                print(f"[!] Found {len(matches)} matches for {kw}")
                # 대표적인 것만 출력 (중복 제거)
                unique_prods = matches[['보험회사', '상품명', '갱신구분']].drop_duplicates(subset=['상품명'])
                for idx, row in unique_prods.head(10).iterrows():
                    print(f"회사: {row['보험회사']} | 상품명: {row['상품명']} | 갱신구분: {row['갱신구분']}")
                print("-" * 30)
    except Exception as e:
        print(f"[-] Error: {e}")

if __name__ == "__main__":
    find_product()
