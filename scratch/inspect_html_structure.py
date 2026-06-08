import os
import io
import pandas as pd
from bs4 import BeautifulSoup

file_path = "../file_0.xls"
content = ""
for enc in ['cp949', 'euc-kr', 'utf-8']:
    try:
        with open(file_path, 'r', encoding=enc) as f:
            content = f.read()
            if '<table' in content.lower():
                print(f"Successfully decoded with {enc}")
                break
    except Exception as e:
        continue

if not content:
    print("Could not read content")
    exit()

soup = BeautifulSoup(content, 'html.parser')
title = soup.find('title')
if title:
    print("Title:", title.get_text())

# Print first table rows
table = soup.find('table')
if table:
    rows = table.find_all('tr')
    print(f"Number of rows in first table: {len(rows)}")
    for i, tr in enumerate(rows[:15]):
        cells = [td.get_text(separator=' ').strip() for td in tr.find_all(['td', 'th'])]
        print(f"Row {i}: {cells[:10]}")
else:
    print("No table found")

# Look for keywords related to payment cycle
keywords = ['월납', '연납', '1년납', '연', '월', '일시납', '납기', '주기']
found_kws = [kw for kw in keywords if kw in content]
print("Found keywords in content:", found_kws)
