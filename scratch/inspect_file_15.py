import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def load_df(filepath):
    # Try HTML fallback first since we know it's HTML
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

df = load_df(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_15.xls")
if df is not None:
    print(f"file_15.xls total rows: {len(df)}")
    for i in range(len(df)):
        row = [str(v) for v in df.iloc[i].tolist()]
        print(f"Row {i:02d}: {row[:6]}")
else:
    print("Failed to load file_15.xls")
