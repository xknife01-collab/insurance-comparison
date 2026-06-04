import os
import pandas as pd
import xlrd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_51.xls"

def main():
    wb = xlrd.open_workbook(filepath, encoding_override='cp949')
    sheet = wb.sheet_by_index(0)
    print(f"Total rows: {sheet.nrows}, cols: {sheet.ncols}")
    for r in range(35):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        print(f"Row {r}: {row_vals}")

if __name__ == "__main__":
    main()
