import os
import xlrd
import pandas as pd
import io
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files: {len(files)}")
    
    found_products = []
    for f in sorted(files):
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_df(filepath)
        if df is not None:
            # Look for values in columns that might contain product names (usually col 1 or 2)
            # We can search the entire dataframe for cells containing "재물" or "재산종합" or "성공메이트"
            for r in range(df.shape[0]):
                for c in range(df.shape[1]):
                    val = str(df.iloc[r, c])
                    if any(kw in val for kw in ["재물", "재산종합", "성공메이트"]):
                        found_products.append((f, val, r, c))
                        
    print(f"Found matches: {len(found_products)}")
    unique_files = set()
    for f, val, r, c in found_products:
        unique_files.add(f)
        print(f"File: {f} | Val: {val.strip()[:100]} | Row: {r}, Col: {c}")
        
    print(f"Unique files containing property keywords: {unique_files}")

if __name__ == "__main__":
    main()
