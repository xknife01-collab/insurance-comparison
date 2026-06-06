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
    for f in ['file_12.xls', 'file_15.xls']:
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_html_df(filepath)
        if df is not None:
            print(f"\nFile: {f}")
            # Find rows matching target products
            for idx in range(df.shape[0]):
                row = df.iloc[idx]
                prod_val = str(row.iloc[1]).strip()
                if any(p in prod_val for p in ["환경쏘옥NHe독감케어보험", "효도쏘옥NHe부모님안심보험", "효밍아웃NH부모님안전보험"]):
                    print(f"Row {idx}: {row.dropna().tolist()}")

if __name__ == "__main__":
    main()
