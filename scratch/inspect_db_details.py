import os
import xlrd
import sys

sys.stdout.reconfigure(encoding='utf-8')
SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    filepath = os.path.join(SOURCE_DIR, 'file_38.xls')
    wb = xlrd.open_workbook(filepath, encoding_override="cp949")
    sheet = wb.sheet_by_index(0)
    for r in range(116, 147):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        # print if it starts a product
        if sheet.cell_value(r, 2):
            print(f"Row {r:3d}: Product: {sheet.cell_value(r, 2)} | Col6: {sheet.cell_value(r, 6)} | Col7: {sheet.cell_value(r, 7)}")

if __name__ == "__main__":
    main()
