# -*- coding: utf-8 -*-
import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(path, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

keywords = ["민사", "행정", "소송", "변호사", "법률"]

print("--- Inspecting all matches in file_47.xls ---")
last_company = ""
last_product = ""

for r in range(sheet.nrows):
    row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
    row_str = " ".join([str(v) for v in row_vals])
    
    # Forward fill
    if len(row_vals) > 1 and str(row_vals[1]).strip():
        last_company = str(row_vals[1]).strip()
    if len(row_vals) > 2 and str(row_vals[2]).strip():
        last_product = str(row_vals[2]).strip()
        
    if any(k in row_str for k in keywords):
        # Let's print the row index, filled company/product, and all columns
        cols_str = " | ".join([f"Col{c}: {repr(row_vals[c])}" for c in range(sheet.ncols)])
        print(f"Row {r} (Company: {last_company}, Product: {last_product}):")
        print(f"  {cols_str}")
        print("-" * 60)
