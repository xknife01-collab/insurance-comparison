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
                    # Read all raw rows or use bs4 to find headers
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
        try:
            with open(filepath, 'rb') as file_obj:
                head = file_obj.read(100)
                if b'<table' in head.lower() or b'<html' in head.lower():
                    html_files.append(f)
        except Exception:
            pass
            
    print(f"Total HTML files: {len(html_files)}")
    
    # Let's inspect a few distinct HTML files to see their headers and row contents
    for hf in html_files[:5]:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is not None:
            print(f"\nFile: {hf}")
            # The columns might be a MultiIndex
            print(f"  Columns: {list(df.columns)}")
            # Let's show row 0, 1, 2 to see the actual values
            for idx, row in df.head(2).iterrows():
                print(f"  Row {idx}: {list(row.values)}")

if __name__ == "__main__":
    main()
