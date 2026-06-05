# -*- coding: utf-8 -*-
import os
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

with open("scratch/headers_file47.txt", "w", encoding="utf-8") as f:
    for r in range(15):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        non_empty = [f"Col {c}: {repr(val)}" for c, val in enumerate(row_vals) if val != ""]
        f.write(f"Row {r}: " + ", ".join(non_empty) + "\n")
