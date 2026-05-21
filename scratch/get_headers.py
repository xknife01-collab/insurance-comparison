import csv
import os

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig', errors='ignore') as f:
        reader = csv.reader(f)
        header = next(reader)
        print("EXACT_HEADERS")
        print(header)
except Exception as e:
    print(f"Error: {e}")
