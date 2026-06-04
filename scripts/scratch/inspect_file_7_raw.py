import os
import pandas as pd
from bs4 import BeautifulSoup
from io import StringIO

filepath = r"insurance_data/5_savings/variable_term/file_7.xls"

# Let's read the file using BeautifulSoup to see the HTML structure and find all rows
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

print("=== RAW HTML ROWS IN file_7.xls ===")
for idx, r in enumerate(rows):
    # Print rows containing "헤리티지" or "보험료" or "가입금액"
    r_str = " | ".join(r)
    if any(k in r_str for k in ["헤리티지", "정기", "보험료", "보험가격"]):
        print(f"Row {idx}: {r_str}")
        print("-" * 120)
