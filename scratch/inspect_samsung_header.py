import pandas as pd
import openpyxl
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

file_path = "insurance_data/1_guaranteed/brain/뇌보험_담보_통합_최종_성별분리.xlsx"

# Let's inspect the first sheet's top 10 rows using openpyxl to get original values without pandas header parsing
wb = openpyxl.load_workbook(file_path, data_only=True)
sheet = wb.active

print("--- Top 8 Rows of Excel Sheet ---")
for r in range(1, 9):
    row_vals = [sheet.cell(r, c).value for c in range(1, 20)]
    print(f"Row {r}: {row_vals}")
