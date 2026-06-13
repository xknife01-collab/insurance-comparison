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
    # Print row 5 (header) and row 6 (header)
    print("Row 05:", df.iloc[5].tolist())
    print("Row 06:", df.iloc[6].tolist())
    print("Row 56:")
    for idx, (h1, h2, val) in enumerate(zip(df.iloc[5], df.iloc[6], df.iloc[56])):
        print(f"Col {idx:02d}: [{h1} / {h2}] -> {val}")
else:
    print("Could not load file.")
