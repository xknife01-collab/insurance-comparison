import os
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

wb = xlrd.open_workbook(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls", encoding_override='cp949')
sheet = wb.sheet_by_index(0)
print(f"file_47.xls total rows: {sheet.nrows}")
for i in range(sheet.nrows):
    row = [str(sheet.cell_value(i, j)) for j in range(sheet.ncols)]
    row_str = " ".join(row)
    if "오잘공" in row_str or "DB손보" in row_str or "카트" in row_str:
        print(f"Row {i:04d}: {row}")
