import os
import pandas as pd
import io

def load_df(filepath):
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
    return None

def run():
    source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(source_dir) if "20260608162031320" in f]
    if not files:
        print("[-] Raw file not found")
        return
        
    filepath = os.path.join(source_dir, files[0])
    print(f"Reading {filepath}")
    df = load_df(filepath)
    if df is None:
        print("[-] Load failed")
        return
    for i in range(min(50, len(df))):
        print(f"Row {i}: {df.iloc[i].tolist()[:10]}")

if __name__ == '__main__':
    run()
