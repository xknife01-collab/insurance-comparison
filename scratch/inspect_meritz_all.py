# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

current_company = ""
current_product = ""
matching_rows = []

for idx, row in df.iterrows():
    c = str(row[1]).strip() if pd.notna(row[1]) else ""
    p = str(row[2]).strip() if pd.notna(row[2]) else ""
    if c: current_company = c
    if p: current_product = p
    
    if "성공파트너" in current_product:
        matching_rows.append((idx, current_company, current_product, row.tolist()))

with open("scratch/inspect_meritz_all.txt", "w", encoding="utf-8") as out:
    for idx, c, p, r_list in matching_rows:
        non_empty = {i: v for i, v in enumerate(r_list) if pd.notna(v) and str(v).strip()}
        out.write(f"Row {idx}: {non_empty}\n")

print(f"Meritz rows written. Total: {len(matching_rows)}")
