import pandas as pd
import os

f = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\file_31.xls'
df = pd.read_excel(f, engine='xlrd', header=None)

for idx, row in df.iterrows():
    row_list = [str(v) for v in row.tolist()]
    row_str = " ".join(row_list)
    if 'Ｚ' in row_str or '삼성' in row_str or '޸' in row_str or '메리츠' in row_str:
        print(f"ROW {idx}: {row_list}")
