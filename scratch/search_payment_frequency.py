# -*- coding: utf-8 -*-
import os
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(filepath, encoding_override='cp949')
sheet = wb.sheet_by_index(0)

# Print all cells in first 15 rows that are not empty
for r in range(15):
    for c in range(sheet.ncols):
        val = sheet.cell_value(r, c)
        if val != "":
            print(f"Row {r}, Col {c}: {repr(val)}")
