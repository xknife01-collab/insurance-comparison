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
    
    found_products = []
    for f in sorted(files):
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_df(filepath)
        if df is not None:
            # product name is usually in column 2 (0-indexed) or column 1
            # let's look at col 1 and col 2
            for col in [1, 2]:
                if col < df.shape[1]:
                    vals = df.iloc[:, col].dropna().unique()
                    for val in vals:
                        val_str = str(val).strip()
                        if any(kw in val_str for kw in ["재물", "재산종합", "성공메이트", "비즈앤안전", "우리집보험", "홈가드", "하우스"]):
                            found_products.append((f, val_str, col))
                            
    print(f"Found product matches: {len(found_products)}")
    for f, prod, col in found_products:
        print(f"File: {f} | Product: {prod} (col {col})")

if __name__ == "__main__":
    main()
