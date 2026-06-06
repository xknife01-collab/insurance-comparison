import os
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def main():
    files = ['file_38.xls', 'file_50.xls']
    for f in files:
        filepath = os.path.join(SOURCE_DIR, f)
        wb = xlrd.open_workbook(filepath, encoding_override="cp949")
        sheet = wb.sheet_by_index(0)
        print(f"\nFile: {f}")
        for r in range(sheet.nrows):
            row_vals = [sheet.cell_value(r, c) for c in range(sheet.ncols)]
            row_str = " ".join(str(v) for v in row_vals)
            # if row has product or starts a product
            if sheet.cell_value(r, 2): # product name
                prod = sheet.cell_value(r, 2)
                # check if there are cycle words in the row or subsequent rows of this product
                print(f"Row {r:3d}: Product: {prod}")
                # check for cycle words
                for cycle_word in ["월납", "연납", "1년", "일시납", "납입주기"]:
                    if cycle_word in row_str:
                        print(f"  Found '{cycle_word}' in current row")
                # check in details (usually the last column or similar)
                for val in row_vals:
                    val_str = str(val)
                    if len(val_str) > 100: # details text
                        for cycle_word in ["월납", "연납", "1년", "일시납", "납입주기"]:
                            if cycle_word in val_str:
                                print(f"  Found '{cycle_word}' in details: {val_str[:120]}...")

if __name__ == "__main__":
    main()
