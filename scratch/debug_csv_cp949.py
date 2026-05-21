import csv
import os

CSV_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

# Try cp949
with open(CSV_FILE, mode='r', encoding='cp949') as f:
    reader = csv.reader(f)
    next(reader)
    for i, row in enumerate(reader):
        if i > 5: break
        print(f"Row {i}: {row}")
