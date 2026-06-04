import csv

csv_path = r"insurance_data/5_savings/variable_term/extracted_data.csv"
with open(csv_path, 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

products = set()
for r in rows:
    products.add((r[0], r[1])) # company, product_name

print(f"Total rows in extracted_data.csv: {len(rows)}")
print(f"Unique products: {len(products)}")
