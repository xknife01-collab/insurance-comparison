import os
import io
import pandas as pd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
KEYWORDS = ["화재", "재물", "재산", "주택", "성공메이트", "비즈", "안전", "홈가드", "하우스", "생활안심"]

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
        try:
            with open(filepath, 'rb') as file_obj:
                head = file_obj.read(100)
                if b'<table' in head.lower() or b'<html' in head.lower():
                    html_files.append(f)
        except Exception:
            pass
            
    print(f"Total HTML files to scan: {len(html_files)}")
    
    matches_found = 0
    for hf in html_files:
        filepath = os.path.join(SOURCE_DIR, hf)
        df = load_html_df(filepath)
        if df is not None:
            # Look at product names (typically col 1)
            # Find any unique values in col 1 that match property keywords
            if df.shape[1] > 1:
                products = df.iloc[:, 1].dropna().unique()
                for prod in products:
                    prod_str = str(prod).strip()
                    if any(kw in prod_str for kw in KEYWORDS):
                        print(f"File: {hf} | Match product: {prod_str}")
                        matches_found += 1
                        
    print(f"Total matches found: {matches_found}")

if __name__ == "__main__":
    main()
