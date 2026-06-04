import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

# Let's find rows for "삼성 탄탄한 변액연금보험"
matching_rows = [row for row in rows if "삼성 탄탄한 변액연금보험" in row[1]]

print(f"Total rows matching: {len(matching_rows)}")
for i, r in enumerate(matching_rows[:10]):
    print(f"Match {i}:")
    print(f"  Gubun: {r[2]}")
    print(f"  Standard columns: {r[0]} | {r[1]} | {r[2]} | {r[3]} | {r[4]} | {r[5]} | {r[6]} | {r[7]} | {r[8]} | {r[9]} | {r[10]} | {r[11]}")
    print(f"  Raw 1-15: {r[12:27]}")
    print(f"  Raw 16-30: {r[27:42]}")
    print("-" * 100)
