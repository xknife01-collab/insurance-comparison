import pandas as pd
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

file_path = "../장기보장성 비교 공시 (7).xls"

print(f"Reading {file_path} via xlrd...")
df = pd.read_excel(file_path, engine='xlrd')

print("\n--- Shape: ---", df.shape)
print("\n--- Top 15 rows: ---")
for idx, row in df.head(15).iterrows():
    print(f"Row {idx}: {row.tolist()}")

print("\n--- Columns: ---")
print(df.columns.tolist())
