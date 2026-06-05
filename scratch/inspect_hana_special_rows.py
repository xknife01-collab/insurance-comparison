# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

current_company = ""
current_product = ""

rows_to_check = [3033, 3036]

for idx, row in df.iterrows():
    c = str(row[1]).strip() if pd.notna(row[1]) else ""
    p = str(row[2]).strip() if pd.notna(row[2]) else ""
    if c: current_company = c
    if p: current_product = p
    
    if idx in rows_to_check:
        print(f"Row {idx} belongs to product: {current_product} (company: {current_company})")
