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
                row = df.iloc[321]
                print(f"=== File: 보장성_상품비교_20260608162037508.xls | Row 321 ===")
                for cx, val in enumerate(row.tolist()):
                    print(f"Col {cx}: {repr(val)}")
        break
    except Exception as e:
        print(f"Error with {enc}: {e}")
        continue
