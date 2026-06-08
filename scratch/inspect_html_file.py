import os
import io
from bs4 import BeautifulSoup

file_path = "../file_0.xls"
content = ""

# Try different encodings
for enc in ['cp949', 'euc-kr', 'utf-8']:
    try:
        with open(file_path, 'r', encoding=enc) as f:
            content = f.read()
            if '<table' in content.lower():
                print(f"Decoded successfully with: {enc}")
                break
    except Exception as e:
        continue

if not content:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    print("Fallback to utf-8 ignore")

soup = BeautifulSoup(content, 'html.parser')
output_lines = []

title = soup.find('title')
if title:
    output_lines.append(f"Title: {title.get_text().strip()}")

tables = soup.find_all('table')
output_lines.append(f"Number of tables: {len(tables)}")

for t_idx, table in enumerate(tables):
    output_lines.append(f"\n--- Table {t_idx} ---")
    rows = table.find_all('tr')
    output_lines.append(f"Number of rows: {len(rows)}")
    for r_idx, tr in enumerate(rows[:20]):
        cells = [td.get_text(separator=' ').strip().replace('\n', ' ').replace('\t', ' ') for td in tr.find_all(['td', 'th'])]
        output_lines.append(f"Row {r_idx}: {cells}")

with open("scratch/inspect_output.txt", "w", encoding="utf-8") as out_f:
    out_f.write("\n".join(output_lines))

print("Inspection report saved to scratch/inspect_output.txt")
