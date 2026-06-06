import re

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_in_all_results.txt", "r", encoding="utf-8") as f:
    content = f.read()

matches = re.findall(r"📂 File: (.*?)\n", content)
print("Flagged files:")
for m in matches:
    print(m)
