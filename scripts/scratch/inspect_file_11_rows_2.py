import os
import io
import pandas as pd

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_11.xls"

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

matching = df[df.map(lambda x: any(k in str(x) for k in ["ZERO 정기보험", "교보라플 정기보험", "온라인정기보험"])).any(axis=1)]
print(f"Found {len(matching)} matching rows:")
for idx, row in matching.iterrows():
    print(f"\nRow {idx}:")
    for col_idx, val in enumerate(row):
        if pd.notna(val) and str(val).strip() != "":
            print(f"  Col {col_idx}: {val}")
