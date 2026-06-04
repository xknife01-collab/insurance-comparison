import os
import pandas as pd
import xlrd
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_51.xls"

def main():
    wb = xlrd.open_workbook(filepath, encoding_override='cp949')
    sheet = wb.sheet_by_index(0)
    
    with open("file_51_dump.txt", "w", encoding="utf-8") as out:
        out.write(f"Sheet name: {sheet.name}\n")
        out.write(f"Rows: {sheet.nrows}, Cols: {sheet.ncols}\n\n")
        
        for r in range(sheet.nrows):
            vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
            out.write(f"Row {r}: {vals}\n")

if __name__ == "__main__":
    main()
