# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

with open("scratch/headers_47.txt", "w", encoding="utf-8") as out:
    for r in range(25):
        row_vals = df.iloc[r].tolist()
        out.write(f"Row {r}: {row_vals}\n")

print("Written to scratch/headers_47.txt")
