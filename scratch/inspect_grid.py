import os
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    filepath = os.path.join(SOURCE_DIR, 'file_38.xls')
    wb = xlrd.open_workbook(filepath, encoding_override="cp949")
    sheet = wb.sheet_by_index(0)
    for r in range(5, 30):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        print(f"Row {r:2d}: {row_vals}")

if __name__ == "__main__":
    main()
