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

with open("scripts/scratch/inspect_file_11_top.txt", "w", encoding="utf-8") as f:
    f.write("First 10 rows:\n")
    for i in range(15):
        f.write(f"\nRow {i}:\n")
        for col_idx, val in enumerate(df.iloc[i]):
            f.write(f"  Col {col_idx}: {val}\n")
