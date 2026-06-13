import pandas as pd
import io

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
    for idx, row in df.iterrows():
        row_str = [str(x).strip() for x in row.tolist()]
        if any('542,800' in x or '542800' in x or '534,400' in x for x in row_str):
            print(f"Row {idx:02d}: {row_str}")
else:
    print("Could not load file.")
