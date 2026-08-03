import csv
import os

CSV_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

with open(CSV_FILE, mode='r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    next(reader) # skip header
    for i, row in enumerate(reader):
        if i > 10: break
        print(f"Row {i}: {row}")
