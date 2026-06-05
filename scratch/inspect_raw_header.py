import os
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

wb = xlrd.open_workbook(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls", encoding_override='cp949')
sheet = wb.sheet_by_index(0)
for i in range(10):
    row = [sheet.cell_value(i, j) for j in range(sheet.ncols)]
    print(f"Row {i:02d}: {row}")
