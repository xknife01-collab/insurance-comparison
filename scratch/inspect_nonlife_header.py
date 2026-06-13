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

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\장기보장성 비교 공시 (5).xls"
df = load_raw_df(filepath)
if df is not None:
    print("=== FIRST 20 ROWS ===")
    for idx, row in df.iloc[:20].iterrows():
        print(f"Row {idx:02d}: {[str(x).strip() for x in row.tolist()[:10]]}")
else:
    print("Could not load file.")
