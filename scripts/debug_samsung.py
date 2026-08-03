import pandas as pd
import os

f = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\file_47.xls'
print(f"[*] Debugging Samsung/Meritz in {f}")
try:
    df = pd.read_excel(f, engine='xlrd', header=None)
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.tolist()])
        if any(k in row_str for k in ['삼성', 'Ｚ', '메리츠', '޸']):
            print(f"ROW {idx}: {row_str[:200]}")
except Exception as e:
    print(f"[ERR] {e}")
