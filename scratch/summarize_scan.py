import re

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_scan_results.txt", "r", encoding="utf-8") as f:
    content = f.read()

matches = re.findall(r"\[\+\] File: (.*?)\n(.*?)\n", content, re.DOTALL)
for filename, products in matches:
    print(f"File: {filename.strip()}")
    print(f"  {products.strip()}")
