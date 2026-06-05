import os
import io
import pandas as pd

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filepath = os.path.join(SOURCE_DIR, "file_15.xls")

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception:
        pass
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
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

df, method = load_df(filepath)
if df is not None:
    print(f"File: file_15.xls ({method})")
    # Print the columns that contain any text about premium details
    for idx, val in enumerate(df.iloc[0].tolist()):
        print(f"Col {idx}: {str(val)[:100]}")
    # Sample a row
    mask = df.astype(str).apply(lambda row: row.str.contains('패밀리케어').any(), axis=1)
    matched = df[mask]
    if len(matched) > 0:
        sample = matched.iloc[0].tolist()
        print("\nMatched Row:")
        for idx, val in enumerate(sample):
            v_str = str(val).replace('\n', ' ').strip()
            print(f"  Col {idx}: {v_str}")
