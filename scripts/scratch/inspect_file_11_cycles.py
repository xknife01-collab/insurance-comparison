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

# Let's inspect all unique values in columns that might indicate payment frequency or cycle, or any cell containing "납입주기"
for i in range(len(df)):
    row_str = " ".join(df.iloc[i].astype(str).tolist())
    if "납입주기" in row_str or "납입방법" in row_str or "주기" in row_str:
        print(f"Row {i} contains keyword:")
        for col_idx, val in enumerate(df.iloc[i]):
            if pd.notna(val) and str(val).strip() != "":
                print(f"  Col {col_idx}: {val}")
