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

# Search for "(무)New간편요양" rows and dump entire row information, including "상세안내" column
rows_info = []
for i in range(len(df)):
    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
    if any("New간편요양" in v for v in row):
        rows_info.append(f"Row {i} details:")
        for col_idx, val in enumerate(row):
            if val:
                rows_info.append(f"  Col {col_idx}: {val}")
        rows_info.append("-" * 50)

# Write to scratch file
with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\db_detail_check.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(rows_info))
print("Done detailed export.")
