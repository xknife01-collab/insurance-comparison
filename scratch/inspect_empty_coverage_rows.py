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
    for r in range(7, sheet.nrows):
        cov = str(sheet.cell_value(r, 3)).strip()
        reason = str(sheet.cell_value(r, 4)).strip()
        amt = str(sheet.cell_value(r, 5)).strip()
        if not cov and (reason or amt):
            print(f"Row {r:3d} (Product: {sheet.cell_value(r, 2) or 'Cont'}): Cov='{cov}', Reason='{reason[:50]}', Amt='{amt}'")
            # print previous row as well
            prev_cov = str(sheet.cell_value(r-1, 3)).strip()
            prev_reason = str(sheet.cell_value(r-1, 4)).strip()
            prev_amt = str(sheet.cell_value(r-1, 5)).strip()
            print(f"  Prev Row {r-1:3d}: Cov='{prev_cov}', Reason='{prev_reason[:50]}', Amt='{prev_amt}'")

if __name__ == "__main__":
    main()
