# -*- coding: utf-8 -*-
import pandas as pd
import io
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls"

def load_df(filepath):
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

df = load_df(filepath)
if df is not None:
    with open("scratch/caregiving_headers.txt", "w", encoding="utf-8") as out:
        for r in range(min(15, len(df))):
            row_vals = df.iloc[r].tolist()
            out.write(f"Row {r}: {row_vals}\n")
    print("Written to scratch/caregiving_headers.txt")
else:
    print("Failed to load file_10.xls")
