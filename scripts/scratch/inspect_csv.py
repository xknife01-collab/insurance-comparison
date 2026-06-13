import csv

csv_path = "insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, "r", encoding="utf-8") as f:
    rdr = csv.reader(f)
    headers = next(rdr)
    print("Headers:", headers)
    for i in range(15):
        row = next(rdr, None)
        if row:
            print(f"Row {i+1}:", {h: r for h, r in zip(headers, row) if r})
