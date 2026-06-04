import os
import pandas as pd
from bs4 import BeautifulSoup

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

with open("scripts/scratch/hanwha_ceo_rows.txt", "w", encoding="utf-8") as f_out:
    f_out.write(f"Total rows in table: {len(rows)}\n\n")
    for idx, r in enumerate(rows):
        r_str = " | ".join(r)
        if "경영인H정기보험" in r_str:
            f_out.write(f"Row {idx}: {r_str}\n")
            f_out.write("-" * 120 + "\n")
