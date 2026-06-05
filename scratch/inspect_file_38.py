# -*- coding: utf-8 -*-
import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
wb = xlrd.open_workbook(path, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

print("--- Matches in file_38.xls ---")
for r in range(sheet.nrows):
    row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
    row_str = " ".join([str(v) for v in row_vals])
    if "변호사" in row_str:
        print(f"Row {r}:")
        for c, val in enumerate(row_vals):
            if val:
                print(f"  Col {c}: {repr(val)}")
        print("-" * 60)
