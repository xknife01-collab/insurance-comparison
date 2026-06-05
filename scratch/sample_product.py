import pandas as pd
import os
import sys

def inspect_sample_product():
    sys.stdout.reconfigure(encoding='utf-8')
    
    xlsx_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\pet\extracted_data.xlsx"
    if not os.path.exists(xlsx_path):
        print(f"[-] File not found")
        return

    df = pd.read_excel(xlsx_path)
    
    # Let's filter by a specific product
    # E.g. Hyundai Marine
    sub_df = df[df['보험회사'].str.contains('현대', na=False)]
    print(f"Total Hyundai rows: {len(sub_df)}")
    
    # Print the first 10 rows completely with non-null columns
    for idx, row in sub_df.head(10).iterrows():
        print(f"\n--- Row {idx} ---")
        for col in df.columns:
            if pd.notna(row[col]) and str(row[col]).strip() != '':
                print(f"  {col}: {row[col]}")

if __name__ == "__main__":
    inspect_sample_product()
