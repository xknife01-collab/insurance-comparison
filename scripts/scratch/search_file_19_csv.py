import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

for row in rows:
    if "file_19.xls" in row:
        print(f"Product: {row[1]} | Premium: {row[7]} (male), {row[8]} (female) | Col28: {row[27][:150]}")
