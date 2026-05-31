import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except:
        df = pd.read_csv(csv_path, encoding='cp949')

    # Print total row count
    print(f"Total Rows: {len(df)}")
    
    # Filter only rows containing '간병' in any column to see what we have
    # Let's inspect unique 담보명(급부명)
    riders = df['담보명(급부명)'].dropna().unique()
    print("\n--- Unique Rider Names ---")
    for r in riders[:40]:
        print(f"- {r}")

    # Let's see unique 상품명
    products = df['상품명'].dropna().unique()
    print("\n--- Unique Product Names ---")
    for p in products[:40]:
        print(f"- {p}")

if __name__ == "__main__":
    run()
