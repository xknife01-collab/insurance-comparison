import pandas as pd
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

file_path = "insurance_data/1_guaranteed/brain/뇌보험_담보_통합_최종_성별분리.xlsx"
df = pd.read_excel(file_path)

print("Columns:")
print(df.columns.tolist())

samsung = df[df.iloc[:, 0].astype(str).str.contains("삼성화재", na=False)]
print(f"\nFound {len(samsung)} Samsung rows")

for idx, row in samsung.iterrows():
    print(f"\n--- Row {idx} ---")
    for col, val in zip(df.columns, row):
        print(f"  {col}: {val}")
