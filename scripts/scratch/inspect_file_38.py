import pandas as pd
import os
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filename = "file_38.xls"

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
    filepath = os.path.join(SOURCE_DIR, filename)
    df = load_df(filepath)
    if df is None:
        print("Failed to load")
        return
    print(f"Loaded {filename}, shape: {df.shape}")
    
    # Print product names and rider names in file_38
    riders = set()
    prods = set()
    for idx, row in df.iterrows():
        row_list = [clean_val(v) for v in row.tolist()]
        if len(row_list) > 3:
            prods.add(row_list[1])
            riders.add(row_list[3])
            
    print("Products in file_38:")
    for p in sorted(list(prods))[:10]:
        print(f"  - {p}")
    print("Riders in file_38:")
    for r in sorted(list(riders))[:20]:
        print(f"  - {r}")

if __name__ == "__main__":
    run()
