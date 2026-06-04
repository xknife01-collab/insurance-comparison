import os
from bs4 import BeautifulSoup

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\5_savings\variable_term\file_1.xls"
if not os.path.exists(filepath):
    filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_1.xls"

with open(filepath, "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")
table = soup.find("table")
rows = []
if table:
    for tr in table.find_all("tr"):
        row = [td.get_text(strip=True) for td in tr.find_all(["td", "th"])]
        if row:
            rows.append(row)

print("=== SEARCHING 577,000 or 330,000 IN file_1.xls ===")
for idx, r in enumerate(rows):
    r_str = " | ".join(r)
    if "577,000" in r_str or "330,000" in r_str:
        print(f"Row {idx}: {r_str}")
        print("-" * 120)
