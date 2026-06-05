import pandas as pd
import json
import sys

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident\extracted_data.csv"

try:
    df = pd.read_csv(csv_path, encoding='utf-8')
    # Filter rows with non-empty product name and company
    df = df.dropna(subset=['보험회사', '상품명'])
    df = df[df['보험회사'].str.strip() != '']
    df = df[df['상품명'].str.strip() != '']
    
    # Clean up company name and product name
    df['보험회사'] = df['보험회사'].str.strip()
    df['상품명'] = df['상품명'].str.strip()
    df['기준보험료'] = df['기준보험료'].str.strip()
    df['가입보험료'] = df['가입보험료'].str.strip()
    
    unique_prods = df.groupby(['보험회사', '상품명']).first().reset_index()
    
    print(f"| 보험회사 | 상품명 | 남성 기준보험료 | 여성 가입보험료 |")
    print(f"| --- | --- | --- | --- |")
    for _, row in unique_prods.iterrows():
        comp = row['보험회사']
        prod = row['상품명']
        male_prem = row['기준보험료'] if pd.notna(row['기준보험료']) and row['기준보험료'] != '' else '-'
        female_prem = row['가입보험료'] if pd.notna(row['가입보험료']) and row['가입보험료'] != '' else '-'
        print(f"| {comp} | {prod} | {male_prem} | {female_prem} |")
        
except Exception as e:
    print(f"Error reading CSV: {e}", file=sys.stderr)
