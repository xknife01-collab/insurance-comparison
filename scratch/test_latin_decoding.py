# -*- coding: utf-8 -*-
import xlrd

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
wb = xlrd.open_workbook(path)
sheet = wb.sheet_by_index(0)

print("Row 84 cells:")
for i in range(sheet.ncols):
    val = sheet.cell_value(84, i)
    print(f"Col {i}: original={repr(val)}")
    if isinstance(val, str) and val.strip():
        try:
            decoded = val.encode('latin-1').decode('cp949')
            print(f"  Decoded: {repr(decoded)}")
        except Exception as e:
            print(f"  Decode failed: {e}")
