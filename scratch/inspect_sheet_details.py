import xlrd
import os

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def inspect_file(fname):
    fpath = os.path.join(parent_dir, fname)
    wb = xlrd.open_workbook(fpath)
    print(f"File: {fname}")
    for idx, sheet in enumerate(wb.sheets()):
        print(f"  Sheet {idx}: {sheet.name} (Rows: {sheet.nrows}, Cols: {sheet.ncols})")
        # Print first 5 rows
        for r in range(min(10, sheet.nrows)):
            row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
            print(f"    Row {r}: {row_vals}")

inspect_file("file_38.xls")
print("-" * 50)
inspect_file("file_50.xls")
