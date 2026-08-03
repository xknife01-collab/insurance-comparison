import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\cancer\extracted_data.csv'

def find_product_strict():
    try:
        df = pd.read_csv(csv_path, encoding='utf-8')
        
        # 'New', '간편', '암', '2501' 중 2개 이상 포함된 것 찾기
        matches = df[
            df['상품명'].str.contains('New', na=False, case=False) &
            df['상품명'].str.contains('간편', na=False) &
            df['상품명'].str.contains('암', na=False)
        ]
        
        if not matches.empty:
            print(f"[!] Found {len(matches)} matches")
            unique_prods = matches[['보험회사', '상품명', '갱신구분']].drop_duplicates(subset=['상품명'])
            for idx, row in unique_prods.iterrows():
                print(f"회사: {row['보험회사']} | 상품명: {row['상품명']} | 갱신구분: {row['갱신구분']}")
        else:
            print("[-] No matches found even with combined search.")
            
    except Exception as e:
        print(f"[-] Error: {e}")

if __name__ == "__main__":
    find_product_strict()
