import os
import io
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "binary"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], "html"
            except Exception:
                continue
    except Exception:
        pass
    return None, None

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
print(f"Total files: {len(files)}")
for filename in sorted(files):
    filepath = os.path.join(SOURCE_DIR, filename)
    df, method = load_df(filepath)
    if df is not None:
        # Find product name keywords to see what's in this file
        products = []
        for i in range(min(50, len(df))):
            for v in df.iloc[i].tolist():
                v_str = str(v)
                if any(kw in v_str for kw in ["변액", "정기"]):
                    products.append(v_str.strip())
        products = list(set([p[:40] for p in products if len(p) > 2]))[:3]
        print(f"File: {filename} | Format: {method} | Sample products: {products}")
    else:
        print(f"File: {filename} | Read failed")
