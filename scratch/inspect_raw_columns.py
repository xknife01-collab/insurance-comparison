import os
import io
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]

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

for f in files:
    path = os.path.join(SOURCE_DIR, f)
    df, method = load_df(path)
    if df is None: continue
    
    print(f"\nFile: {f} ({method})")
    # Find rows with '변액' or '정기'
    mask = df.astype(str).apply(lambda row: row.str.contains('정기|변액').any(), axis=1)
    matched = df[mask]
    if len(matched) > 0:
        sample = matched.iloc[0].tolist()
        print("  Sample row:")
        for idx, val in enumerate(sample[:30]):
            v_str = str(val).replace('\n', ' ').strip()
            # If the value contains any keywords indicating payment cycle, print it
            if any(k in v_str for k in ["월납", "연납", "일시납", "매월", "매년", "연기준"]):
                print(f"    Col {idx}: {v_str}")
