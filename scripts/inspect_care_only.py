import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except:
        df = pd.read_csv(csv_path, encoding='cp949')

    # Filter out products containing "치매"
    df_filtered = df[~df['상품명'].str.contains('치매|CDR', case=False, na=False)]
    
    # Filter products/riders related to caregiving
    care_keywords = '간병|간병인|요양|재가|시설|장기요양'
    df_care = df_filtered[
        df_filtered['상품명'].str.contains(care_keywords, case=False, na=False) |
        df_filtered['담보명(급부명)'].str.contains(care_keywords, case=False, na=False)
    ]
    
    print(f"Total pure caregiving rows: {len(df_care)}")
    
    # Show first 20 records with product_name, rider_name, premium, file, and details
    columns_to_show = ['보험회사', '상품명', '구분', '담보명(급부명)', '기준보험료', '가입보험료', 'source_file', '상세안내']
    for idx, row in df_care.head(30).iterrows():
        print(f"\n[{idx}] {row['보험회사']} | {row['상품명']}")
        print(f"  Rider: {row['담보명(급부명)']} | BasePrem: {row['기준보험료']} | PayPrem: {row['가입보험료']}")
        print(f"  File: {row['source_file']} | Guide: {str(row['상세안내'])[:120]}...")

if __name__ == "__main__":
    run()
