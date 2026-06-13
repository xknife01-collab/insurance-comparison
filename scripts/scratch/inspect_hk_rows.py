import pandas as pd
import io
import sys
import os
import re

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
                # Filter for Heungkuk 1종 (비갱신형)
                hk_df = df[df.iloc[:, 1].astype(str).str.contains("흥국생명 온라인정기보험_1종", na=False)]
                print("=== HEUNGKUK ROWS ===")
                for idx, row in hk_df.iterrows():
                    print({
                        "구분": row.iloc[2],
                        "담보명": row.iloc[3],
                        "가입금액": row.iloc[6],
                        "기준보험료(남)": row.iloc[7],
                        "가입보험료(여)": row.iloc[8],
                        "갱신구분": row.iloc[24]
                    })
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
