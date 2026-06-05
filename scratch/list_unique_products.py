import csv

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
unique_products = set()
with open(csv_path, "r", encoding="utf-8-sig", errors="ignore") as f:
    reader = csv.reader(f)
    headers = next(reader)
    company_idx = headers.index("보험회사")
    product_idx = headers.index("상품명")
    sub_type_idx = headers.index("sub_type")
    
    for row in reader:
        unique_products.add((row[company_idx], row[product_idx], row[sub_type_idx]))

import sys
sys.stdout.reconfigure(encoding='utf-8')
for c, p, s in sorted(unique_products):
    print(f"{c} | {p} | {s}")
