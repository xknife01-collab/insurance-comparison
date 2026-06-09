import pandas as pd
import os
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

FILE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

if not os.path.exists(FILE_PATH):
    print("File not found!")
    sys.exit(1)

df = pd.read_excel(FILE_PATH)

target_products = ["The(더)Dream", "iM 프리미엄건강보험", "KDB든든한"]
print("--- Inspecting problematic products ---")
for kw in target_products:
    sub = df[df['상품명'].astype(str).str.contains(kw, na=False)]
    print(f"\nKeyword: {kw} | Found rows: {len(sub)}")
    for idx, r in sub.head(10).iterrows():
        print(f"Product: {r['상품명']} | 구분: {r['구분']} | 기준보험료: {r['기준보험료']} | 가입보험료: {r['가입보험료']}")
        # Print all columns that are not empty
        row_dict = {col: r[col] for col in df.columns if pd.notna(r[col]) and str(r[col]).strip() != ""}
        print(f"  Non-empty cols: {row_dict}")
