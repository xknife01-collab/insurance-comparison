import xlrd
import sys

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_38.xls"
try:
    wb = xlrd.open_workbook(path)
    sheet = wb.sheet_by_index(0)
    print(f"Sheet Name: {sheet.name}")
    print(f"Rows: {sheet.nrows}, Cols: {sheet.ncols}")
    
    # Print first 20 rows
    for r in range(min(20, sheet.nrows)):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        # Print representation of each cell
        print(f"Row {r}: {row_vals}")
except Exception as e:
    print(f"Error: {e}")
