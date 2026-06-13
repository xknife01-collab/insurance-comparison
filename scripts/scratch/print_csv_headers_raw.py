import sys
sys.stdout.reconfigure(encoding='utf-8')

import csv

csv_path = "insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, "r", encoding="utf-8-sig") as f:
    rdr = csv.reader(f)
    headers = next(rdr)
    print("Exact UTF-8 headers:")
    for idx, h in enumerate(headers):
        print(f"{idx}: {h}")
