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
print(f"Total extracted rows: {len(df)}")

# Let's see unique values in '구분' (which represents the plan type/payment cycle in Association Excel)
print("\nUnique '구분' values:")
print(df['구분'].value_counts().head(30))

print("\nRows with high premiums:")
high_df = df[df['기준보험료'].astype(str).str.replace(',', '').str.extract(r'(\d+)').astype(float)[0] > 200000]
for idx, r in high_df.head(20).iterrows():
    print(f"Company: {r['보험회사']} | Product: {r['상품명']} | 구분: {r['구분']} | 기준보험료: {r['기준보험료']} | 가입보험료: {r['가입보험료']}")
