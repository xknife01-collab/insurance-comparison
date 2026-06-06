import os
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    files = ['file_38.xls', 'file_50.xls', '장기보장성 비교 공시 (1).xls', '장기보장성 비교 공시.xls']
    for f in files:
        filepath = os.path.join(SOURCE_DIR, f)
        if not os.path.exists(filepath):
            print(f"File not found: {f}")
            continue
        try:
            wb = xlrd.open_workbook(filepath, encoding_override="cp949")
            sheet = wb.sheet_by_index(0)
            print(f"\nFile: {f}")
            print(f"  Rows: {sheet.nrows}, Cols: {sheet.ncols}")
            # print rows 4 to 15
            for r in range(min(sheet.nrows, 15)):
                row_vals = [str(sheet.cell_value(r, c))[:50].strip() for c in range(sheet.ncols) if sheet.cell_value(r, c) != ""]
                print(f"    Row {r}: {row_vals}")
        except Exception as e:
            print(f"Error reading {f}: {e}")

if __name__ == "__main__":
    main()
