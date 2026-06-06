import xlrd
import os

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def print_decoded(fname):
    fpath = os.path.join(parent_dir, fname)
    wb = xlrd.open_workbook(fpath)
    sheet = wb.sheet_by_index(0)
    print(f"File: {fname}")
    for r in [5, 6]:
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        print(f"  Row {r}: {row_vals}")
    for r in range(7, 12):
        row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
        print(f"  Row {r}: {row_vals}")

print_decoded("file_38.xls")
print("-" * 50)
print_decoded("file_50.xls")
