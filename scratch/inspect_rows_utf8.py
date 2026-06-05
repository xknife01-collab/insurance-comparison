# -*- coding: utf-8 -*-
import os
import pandas as pd
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

target_rows = [84, 91, 2921, 2922, 2925, 3033, 3036]

with open("scratch/inspect_legal_rows_clean.txt", "w", encoding="utf-8") as f:
    for r in target_rows:
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        f.write(f"Row {r}:\n")
        for c_idx, val in enumerate(row_vals):
            if val != "":
                # Try to convert to string and strip
                val_str = str(val).strip()
                f.write(f"  Col {c_idx}: {val_str}\n")
