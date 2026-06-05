# -*- coding: utf-8 -*-
import xlrd

wb = xlrd.open_workbook(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls", encoding_override='cp949')
sheet = wb.sheet_by_index(0)

# Print row 84 elements with index
row_84 = [sheet.cell_value(84, c) for c in range(sheet.ncols)]
for idx, val in enumerate(row_84):
    print(f"Col {idx}: {repr(val)}")
