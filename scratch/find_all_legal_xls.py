# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

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

def search_all():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["민사소송", "형사소송", "행정소송", "법률비용", "교원소청"]
    
    results = []
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        for row_idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            row_str = " ".join(row_list)
            for kw in keywords:
                if kw in row_str:
                    results.append((filename, row_idx, row_list))
                    break
                    
    print(f"Total matching rows across all files: {len(results)}")
    unique_files = set(r[0] for r in results)
    print(f"Unique files: {unique_files}")
    for filename in sorted(unique_files):
        file_rows = [r for r in results if r[0] == filename]
        print(f"\n--- {filename} ({len(file_rows)} rows) ---")
        for f, r_idx, r_list in file_rows:
            non_empty = [v for v in r_list if v]
            print(f"  Row {r_idx}: {non_empty[:6]}")

if __name__ == "__main__":
    search_all()
