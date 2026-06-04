import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

matching_rows = [row for row in rows if "미래에셋생명 헤리티지 변액정기보험" in row[1]]
print(f"Total matching: {len(matching_rows)}")
for idx, r in enumerate(matching_rows):
    print(f"Row {idx}:")
    print(f"  Company: {r[0]}")
    print(f"  Product: {r[1]}")
    print(f"  Gubun: {r[2]}")
    print(f"  Amt: {r[6]}")
    print(f"  Male Premium: {r[7]}")
    print(f"  Female Premium: {r[8]}")
    print(f"  Raw columns: {r[12:20]}")
    print("-" * 100)
