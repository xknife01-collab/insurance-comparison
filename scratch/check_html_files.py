# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def check_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    html_files = []
    binary_files = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        is_html = False
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['utf-8', 'cp949', 'euc-kr']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        is_html = True
                        break
                except Exception:
                    continue
        except Exception:
            pass
            
        if is_html:
            html_files.append(filename)
        else:
            binary_files.append(filename)
            
    print(f"Total files: {len(files)}")
    print(f"HTML files ({len(html_files)}): {html_files[:10]}...")
    print(f"Binary files ({len(binary_files)}): {binary_files[:10]}...")
    
    # Now let's see which HTML files contain legal keywords
    keywords = ["법률", "소송", "민사", "형사", "변호사"]
    html_matches = []
    for filename in html_files:
        filepath = os.path.join(SOURCE_DIR, filename)
        # Load html
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            df = None
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            break
                except Exception:
                    continue
            if df is not None:
                for idx, row in df.iterrows():
                    row_str = " ".join([str(v) for v in row.dropna().tolist()])
                    if any(k in row_str for k in keywords):
                        html_matches.append((filename, idx, row_str))
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            
    print(f"Total HTML matching rows: {len(html_matches)}")
    for f, idx, r_str in html_matches[:10]:
        print(f"  [{f}] Row {idx}: {r_str[:150]}")

if __name__ == "__main__":
    check_files()
