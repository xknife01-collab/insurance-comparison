import xlrd
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\장기보장성 비교 공시 (5).xls"
book = xlrd.open_workbook(file_path)
sheet = book.sheet_by_index(0)

# Find the header row
for r in range(min(15, sheet.nrows)):
    row = [str(sheet.cell_value(r, c)).strip() for c in range(sheet.ncols)]
    print(f"Row {r}: {row[:12]}")
