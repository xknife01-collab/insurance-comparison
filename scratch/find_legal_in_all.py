# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None)
        except Exception:
            try:
                with open(filepath, 'rb') as f:
                    raw_bytes = f.read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                return frames[0]
                    except Exception:
                        continue
            except Exception:
                pass
    return None

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
print(f"Scanning {len(files)} files...")

keywords = ["민사소송", "행정소송", "법률비용", "소송비용", "소송법률"]

matches = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df = load_df(filepath)
    if df is None:
        continue
    
    for idx, row in df.iterrows():
        row_str = " | ".join([str(v) for v in row.tolist()])
        if any(kw in row_str for kw in keywords):
            matches.append((filename, idx, row.tolist()))

print(f"Found {len(matches)} matches total.")
# Let's print out unique files and some matching rows
unique_files = set(m[0] for m in matches)
print("Unique files:", unique_files)

# Print first 20 matches details
for filename, idx, row_vals in matches[:30]:
    # Clean up nan values for printing
    cleaned_vals = ["" if pd.isna(v) else str(v).strip() for v in row_vals]
    print(f"File: {filename}, Row: {idx}")
    print(f"  Values: {' | '.join(cleaned_vals[:12])}")
