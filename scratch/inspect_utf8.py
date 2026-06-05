# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

rows_to_check = [84, 91, 2921, 2922, 2925, 3033, 3036]

with open("scratch/inspect_utf8.txt", "w", encoding="utf-8") as out:
    for r in rows_to_check:
        if r < len(df):
            row_vals = df.iloc[r].tolist()
            out.write(f"\nRow {r}:\n")
            for i, val in enumerate(row_vals):
                if pd.notna(val) and str(val).strip():
                    out.write(f"  Col {i}: {val}\n")

print("Written to scratch/inspect_utf8.txt")
