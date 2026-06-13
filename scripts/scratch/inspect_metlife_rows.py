import pandas as pd
import io
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join("..", "보장성_상품비교_20260608162037508.xls")

with open(filepath, "rb") as f:
    raw_bytes = f.read()

for enc in ['utf-8', 'cp949', 'euc-kr']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                for idx, row in df.iterrows():
                    pname = str(row.iloc[1])
                    if "더해주고채워주는정기보험" in pname:
                        print(f"Row {idx}: Company={row.iloc[0]}, Product={row.iloc[1]}, Gubun={row.iloc[2]}, Damso={row.iloc[5]}, Amount={row.iloc[6]}, PremM={row.iloc[7]}, PremF={row.iloc[8]}")
        break
    except Exception as e:
        print(e)
        continue
