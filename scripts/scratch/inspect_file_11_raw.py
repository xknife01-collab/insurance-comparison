import os
import pandas as pd
from bs4 import BeautifulSoup
import io

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance_data\5_savings\variable_term\file_11.xls"
if not os.path.exists(filepath):
    filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_11.xls"

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

print("=== RAW HTML ROWS FOR 한화생명 경영인 ===")
for idx, r in enumerate(rows):
    r_str = " | ".join(r)
    if "경영인H정기보험" in r_str:
        print(f"Row {idx}: {r_str}")
        print("-" * 120)
