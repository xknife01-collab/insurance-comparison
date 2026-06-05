import pandas as pd
import os
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception as e:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            return frames[0], f"html_{enc}"
                except Exception:
                    continue
        except Exception:
            pass
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

for fname in ["file_47.xls", "file_11.xls", "file_10.xls"]:
    filepath = os.path.join(SOURCE_DIR, fname)
    df, method = load_df(filepath)
    if df is not None:
        print(f"\n=== {fname} ({method}) shape: {df.shape} ===")
        print("Columns:")
        print(list(df.columns))
        print("Rows 0 to 5:")
        for idx in range(min(6, len(df))):
            row_str = " | ".join([clean_val(v) for v in df.iloc[idx].tolist()[:10]])
            print(f"  Row {idx}: {row_str[:150]}")
    else:
        print(f"\n=== {fname} load failed ===")
