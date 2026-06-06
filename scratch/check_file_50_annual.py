import os
import xlrd
import sys

sys.stdout.reconfigure(encoding='utf-8')
SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    for filename in ['file_38.xls', 'file_50.xls']:
        filepath = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(filepath):
            print(f"File {filename} does not exist.")
            continue
            
        wb = xlrd.open_workbook(filepath, encoding_override="cp949")
        sheet = wb.sheet_by_index(0)
        print(f"=== Searching in {filename} ===")
        found_count = 0
        for r in range(sheet.nrows):
            row_vals = [str(sheet.cell_value(r, c)).strip() for c in range(sheet.ncols)]
            row_str = " ".join(row_vals)
            if "연납" in row_str or "1년납" in row_str or "연보험료" in row_str:
                print(f"Row {r:3d}: {row_vals}")
                found_count += 1
        if found_count == 0:
            print("No matching rows containing '연납', '1년납', or '연보험료'.")
            
if __name__ == "__main__":
    main()
