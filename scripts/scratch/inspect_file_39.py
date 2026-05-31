import pandas as pd
import os
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filename = "file_39.xls"

def load_df(filepath):
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

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def run():
    df = load_df(os.path.join(SOURCE_DIR, filename))
    if df is None:
        print("Failed to load")
        return
    print(f"Loaded {filename}, shape: {df.shape}")
    
    # Print first 20 rows
    for i in range(min(20, len(df))):
        print(f"Row {i}: {[clean_val(v) for v in df.iloc[i].tolist()[:8]]}")

if __name__ == "__main__":
    run()
