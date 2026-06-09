import pandas as pd
import os
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

EXCEL_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\뇌보험_담보_통합_최종_성별분리.xlsx'

if os.path.exists(EXCEL_FILE):
    df = pd.read_excel(EXCEL_FILE)
    
    # 20,000원 ~ 40,000원 사이의 3만원대 저가 상품들 필터링
    low_df = df[(df['남성보험료'] >= 20000) & (df['남성보험료'] <= 40000)]
    print(f"Total 30k range rows: {len(low_df)}")
    
    print("\n--- Samples of 30k range brain products ---")
    for idx, row in low_df.head(10).iterrows():
        print(f"Company: {row['보험회사']}")
        print(f"  Product: {row['상품명']}")
        print(f"  Cover (담보명): {row['담보명(급부명)']}")
        print(f"  Male Premium: {row['남성보험료']} | Female Premium: {row['여성보험료']}")
        print(f"  지급사유: {row.get('지급사유', '')}")
        print(f"  가입금액 (Excel): {row.get('가입금액', '')}")
        print(f"  Source File: {row.get('source_file', '')}")
        # Print original columns that might contain payment keywords
        for col in df.columns:
            if col.startswith('원본_열_'):
                val = str(row[col])
                if val and val != 'nan' and any(k in val for k in ["주계약", "기본", "특약", "선택"]):
                    print(f"    {col}: {val}")
        print("-" * 50)
else:
    print("Excel file not found")
