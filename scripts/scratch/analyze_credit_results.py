import re

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\test_extract_credit_out.txt"
with open(out_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Split by File:
blocks = content.split("File: ")
unique_products = {}
for b in blocks[1:]:
    lines = b.strip().split('\n')
    if not lines:
        continue
    file_info = lines[0].split(' | ')[0]
    prod_line = lines[1]
    prod_name = prod_line.replace("Product Guess: ", "").strip()
    if prod_name not in unique_products:
        unique_products[prod_name] = set()
    unique_products[prod_name].add(file_info)

for p, f_set in sorted(unique_products.items()):
    print(f"Product: {p} | Files: {list(f_set)}")
