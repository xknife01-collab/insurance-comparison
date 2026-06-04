import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    print("Headers:", headers)
    
    # Print the first row
    first_row = next(reader)
    for idx, (h, v) in enumerate(zip(headers, first_row)):
        print(f"Col {idx} ({h}): {v}")
