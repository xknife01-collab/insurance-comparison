import os
import io
import pandas as pd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_html_df(filepath):
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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    html_files = []
    for f in sorted(files):
        filepath = os.path.join(SOURCE_DIR, f)
        # check if it starts with table or html
        try:
            with open(filepath, 'rb') as file_obj:
                head = file_obj.read(100)
                if b'<table' in head.lower() or b'<html' in head.lower():
                    html_files.append(f)
        except Exception:
            pass
            
    print(f"Total HTML files: {len(html_files)}")
    
    # Print summary of first 10 html files
    for hf in html_files[:10]:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is not None:
            print(f"\nHTML File: {hf}")
            print(f"  Shape: {df.shape}")
            # print first 3 rows
            for idx, row in df.head(3).iterrows():
                row_vals = [str(v)[:40].strip() for v in row.dropna().tolist()]
                print(f"    Row {idx}: {row_vals}")

if __name__ == "__main__":
    main()
