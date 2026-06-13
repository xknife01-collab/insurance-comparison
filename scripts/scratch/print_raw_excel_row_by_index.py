import pandas as pd
import io
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

files = [f for f in os.listdir("..") if f.endswith(".xls") and "보장성" in f]

for fname in sorted(files):
    filepath = os.path.join("..", fname)
    with open(filepath, "rb") as f:
        raw_bytes = f.read()
    for enc in ['utf-8', 'cp949', 'euc-kr']:
        try:
            raw_text = raw_bytes.decode(enc)
            if '<table' in raw_text.lower():
                frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                if frames:
                    df = frames[0]
                    rows = df[df.iloc[:, 1].str.contains("헤리티지", na=False)]
                    if len(rows) > 0:
                        for rx, row in rows.iterrows():
                            row_list = [str(v).strip() for v in row.tolist()]
                            if "특약" in row_list[2]:
                                print(f"[{fname}] Row {rx} | Prod: {row_list[1]} | Detail: {row_list[3]} | Amt: {row_list[6]} | Prem: {row_list[7]}")
            break
        except Exception:
            continue
