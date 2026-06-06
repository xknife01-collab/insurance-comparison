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
    for f in ['file_15.xls', 'file_25.xls', '보장성_상품비교_20260406102544980.xls']:
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_html_df(filepath)
        if df is not None:
            print(f"\nFile: {f}")
            # check unique products
            # product name is usually in column 1
            products = df.iloc[:, 1].unique()
            print("  Products:")
            for p in products[:5]:
                print(f"    - {p}")
                
if __name__ == "__main__":
    main()
