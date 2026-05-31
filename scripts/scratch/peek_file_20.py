import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
filepath = os.path.join(source_dir, "file_20.xls")

try:
    df = pd.read_excel(filepath, engine='xlrd', header=None)
except Exception as e:
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    for enc in ['cp949', 'euc-kr', 'utf-8']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    break
        except Exception:
            continue

rows = []
for idx, r in df.head(10).iterrows():
    rows.append(f"Row {idx}: {list(r)}")

with open("file_20_peek.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(rows))
