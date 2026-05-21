import csv
import os

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
else:
    try:
        with open(file_path, mode='r', encoding='utf-8-sig', errors='ignore') as f:
            reader = csv.reader(f)
            header = next(reader)
            print("Columns found in CSV:")
            print(header)
            print("\nSample Data (First 10 rows):")
            for i, row in enumerate(reader):
                print(f"Row {i+1}: {row}")
                if i >= 9:
                    break
    except Exception as e:
        print(f"An error occurred: {e}")
