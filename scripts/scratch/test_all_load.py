import os
import io
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]

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

failures = []
for f in files:
    filepath = os.path.join(source_dir, f)
    df, method = load_df(filepath)
    if df is None:
        failures.append(f)
    else:
        print(f"[+] Loaded {f} successfully using {method}. Shape: {df.shape}")

print(f"\nTotal failures: {len(failures)}")
if failures:
    print(f"Failed files: {failures}")
