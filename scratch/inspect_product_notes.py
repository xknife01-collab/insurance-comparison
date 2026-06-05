# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

keywords = ["성공파트너", "교직원 안심보험", "시니어안심보험"]

with open("scratch/product_notes.txt", "w", encoding="utf-8") as out:
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.tolist() if pd.notna(v)])
        if any(k in row_str for k in keywords):
            # Print the entire row
            out.write(f"Row {idx}: {row.tolist()}\n")

print("Done. Check scratch/product_notes.txt")
