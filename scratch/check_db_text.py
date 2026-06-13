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
    raw_desc = str(df.iloc[56, 25])
    col5 = str(df.iloc[56, 5])
    col6 = str(df.iloc[56, 6])
    col7 = str(df.iloc[56, 7])
    col8 = str(df.iloc[56, 8])
    with open("scratch/db_desc_utf8.txt", "w", encoding="utf-8") as f:
        f.write("Row 56 Col 05: " + col5 + "\n")
        f.write("Row 56 Col 06: " + col6 + "\n")
        f.write("Row 56 Col 07: " + col7 + "\n")
        f.write("Row 56 Col 08: " + col8 + "\n")
        f.write("Row 56 Description:\n" + raw_desc + "\n")
    print("Done writing to scratch/db_desc_utf8.txt")
else:
    print("Could not load file.")
