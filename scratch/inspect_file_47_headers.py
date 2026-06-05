# -*- coding: utf-8 -*-
import xlrd
import pandas as pd

wb = xlrd.open_workbook(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls", encoding_override='cp949')
sheet = wb.sheet_by_index(0)

print("Rows around 84:")
for r in range(80, 95):
    row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
    print(f"Row {r}: {row_vals}")

print("\nHeader rows (0 to 10):")
for r in range(15):
    row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
    print(f"Row {r}: {row_vals}")
