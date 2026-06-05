# -*- coding: utf-8 -*-
import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(path)
print("Sheet names:", wb.sheet_names())
for name in wb.sheet_names():
    sh = wb.sheet_by_name(name)
    print(f"Sheet {name}: {sh.nrows} rows, {sh.ncols} cols")
