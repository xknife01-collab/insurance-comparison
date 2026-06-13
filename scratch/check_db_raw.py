import pandas as pd
import io
import os

def load_raw_df(filepath):
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

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\Insurance_disclosure_room_data\보장성_상품비교_20260608162110819.xls"
df = load_raw_df(filepath)
if df is not None:
    print("=== ROWS MATCHING DB생명 or 안심보험 or 542,800 ===")
    for idx, row in df.iterrows():
        row_str = [str(x).strip() for x in row.tolist()]
        # Check if row contains DB생명 or 안심보험 or 542,800
        if any('DB' in x or '안심보험' in x or '542,800' in x for x in row_str):
            print(f"Row {idx:02d}: {row_str[:12]}")
else:
    print("Could not load file.")
