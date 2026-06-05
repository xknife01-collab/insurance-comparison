import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def load_df(filepath):
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

df = load_df(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\보장성_상품비교_20260406102532375.xls")
if df is not None:
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.tolist()])
        if "2288400" in row_str or "2,288,400" in row_str:
            print(f"Row {idx:02d}: {row.tolist()}")
else:
    print("Failed to load")
