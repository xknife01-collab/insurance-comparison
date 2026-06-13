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
    # Write details of row 00, 12, 56, 80 to a utf-8 file to check the exact descriptions
    with open("scratch/life_desc_test.txt", "w", encoding="utf-8") as f:
        for idx in [0, 12, 56, 80]:
            f.write(f"=== Row {idx} ===\n")
            f.write(f"Company: {df.iloc[idx, 0]}\n")
            f.write(f"Product: {df.iloc[idx, 1]}\n")
            f.write(f"Col 07 (Male): {df.iloc[idx, 7]}\n")
            f.write(f"Col 08 (Female): {df.iloc[idx, 8]}\n")
            f.write(f"Description: {df.iloc[idx, 25]}\n\n")
    print("Wrote to scratch/life_desc_test.txt")
else:
    print("Could not load file.")
