import csv
import os

CSV_FILE = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\extracted_data.csv'

with open(CSV_FILE, mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    print(f"Header: {header}")
    first_row = next(reader)
    print(f"First Row: {first_row}")
