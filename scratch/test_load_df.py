# -*- coding: utf-8 -*-
import xlrd
import traceback

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
try:
    wb = xlrd.open_workbook(filepath, encoding_override='cp949')
    print("Success opening workbook")
    sheet = wb.sheet_by_index(0)
    print("Success getting sheet")
    row_vals = [sheet.cell_value(84, c) for c in range(sheet.ncols)]
    print("Row 84:", row_vals)
except Exception as e:
    print("Failed:")
    traceback.print_exc()
