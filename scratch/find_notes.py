# -*- coding: utf-8 -*-
import os
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

print("Total rows:", sheet.nrows)
print("Total cols:", sheet.ncols)

# Let's print last 20 rows to scratch/footnotes.txt
with open("scratch/footnotes.txt", "w", encoding="utf-8") as f:
    for r in range(max(0, sheet.nrows - 20), sheet.nrows):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        non_empty = [f"Col {c}: {repr(val)}" for c, val in enumerate(row_vals) if val != ""]
        if non_empty:
            f.write(f"Row {r}: " + ", ".join(non_empty) + "\n")
