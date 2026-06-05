# -*- coding: utf-8 -*-
import os
import pandas as pd
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

target_rows = [84, 91, 2921, 2922, 2925, 3033, 3036]

for r in target_rows:
    row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
    print(f"Row {r}:")
    for c_idx, val in enumerate(row_vals):
        if val != "":
            print(f"  Col {c_idx}: {repr(val)}")
