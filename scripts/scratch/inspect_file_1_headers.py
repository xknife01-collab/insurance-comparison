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

# Let's print the headers and first 10 rows of table to understand the column labels!
for idx, r in enumerate(rows[:10]):
    print(f"Row {idx}: {' | '.join(r)}")
    print("-" * 100)
