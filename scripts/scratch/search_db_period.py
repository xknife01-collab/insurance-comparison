import pandas as pd
import warnings
import io
import re

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_45.xls"

try:
    df = pd.read_excel(filepath, engine='xlrd', header=None)
except Exception:
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    for enc in ['cp949', 'euc-kr', 'utf-8']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    break
        except Exception:
            continue

# Show first 15 rows of the file
header_rows = []
for i in range(min(30, len(df))):
    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
    header_rows.append(f"Row {i}: {row[:8]}")

# Show last 10 rows of the file
footer_rows = []
start = max(0, len(df) - 15)
for i in range(start, len(df)):
    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
    footer_rows.append(f"Row {i}: {row[:8]}")

# Search for any row mentioning '납' or '주기' or '예시'
search_rows = []
for i in range(len(df)):
    row_str = " ".join([str(v) for v in df.iloc[i].tolist() if pd.notna(v)])
    if any(k in row_str for k in ['납입', '예시', '기준', '일시납', '연납', '월납']):
        search_rows.append(f"Row {i}: {row_str[:200]}")

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\db_period_search.txt", "w", encoding="utf-8") as f:
    f.write("=== HEADER ===\n")
    f.write("\n".join(header_rows))
    f.write("\n\n=== FOOTER ===\n")
    f.write("\n".join(footer_rows))
    f.write("\n\n=== SEARCH RESULTS ===\n")
    f.write("\n".join(search_rows))

print("Search completed.")
