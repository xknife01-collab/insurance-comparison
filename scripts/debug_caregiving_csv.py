import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    print(f"[*] Reading CSV: {csv_path}")
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except Exception as e:
        print(f"[-] UTF-8-sig load failed: {e}. Trying cp949...")
        df = pd.read_csv(csv_path, encoding='cp949')

    print(f"[+] Load Success! Shape: {df.shape}")
    print("\n[*] First 3 rows:")
    print(df.head(3).to_string())

    print("\n[*] Columns in CSV:")
    print(list(df.columns))

    print("\n[*] Unique Companies:")
    print(df['보험회사'].unique())

    print("\n[*] Unique Products (First 15):")
    print(df['상품명'].unique()[:15])

    print("\n[*] Sample unique Riders (First 15):")
    print(df['담보명(급부명)'].dropna().unique()[:15])

if __name__ == "__main__":
    run()
