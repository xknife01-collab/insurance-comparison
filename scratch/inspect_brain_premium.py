import pandas as pd
import os
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

EXCEL_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\뇌보험_담보_통합_최종_성별분리.xlsx'

if os.path.exists(EXCEL_FILE):
    df = pd.read_excel(EXCEL_FILE)
    print("Original rows:", len(df))
    
    # Exclude keywords representing comprehensive bundles
    df_filtered = df[~df['상품명'].str.contains('소방관', na=False)]
    df_filtered = df_filtered[~df_filtered['상품명'].str.contains('종합', na=False)]
    df_filtered = df_filtered[~df_filtered['상품명'].str.contains('건강보험', na=False)]
    df_filtered = df_filtered[~df_filtered['상품명'].str.contains('통합보험', na=False)]
    
    print("After applying strict bundle filters rows:", len(df_filtered))
    
    if not df_filtered.empty:
        print("Max Male Premium in final:", df_filtered['남성보험료'].max())
        print("Max Female Premium in final:", df_filtered['여성보험료'].max())
        
        print("\n--- Remaining Top 15 Highest Male Premium Rows ---")
        for idx, row in df_filtered.sort_values(by='남성보험료', ascending=False).head(15).iterrows():
            print(f"Company: {row['보험회사']} | Product: {row['상품명']} | Cover: {row['담보명(급부명)']} | Male: {row['남성보험료']} | Female: {row['여성보험료']}")
    else:
        print("No rows left after filtering!")
else:
    print("File not found")
