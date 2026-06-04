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

# Save the columns and first 10 rows to a text file for inspection
with open("scripts/scratch/inspect_headers.txt", "w", encoding="utf-8") as f:
    f.write("Columns:\n")
    f.write(str(df.columns.tolist()) + "\n\n")
    f.write("First 10 rows:\n")
    for idx in range(10):
        f.write(f"Row {idx}: {df.iloc[idx].tolist()}\n")
