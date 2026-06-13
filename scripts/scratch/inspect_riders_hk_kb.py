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
                # Filter for Heungkuk online term and Kyobo Life Planet
                hk_rows = df[df.iloc[:, 1].str.contains("온라인정기보험", na=False)]
                kb_rows = df[df.iloc[:, 1].str.contains("교보라플 정기보험", na=False)]
                
                print("=== 흥국생명 온라인정기보험 ===")
                for rx, row in hk_rows.iterrows():
                    row_list = [str(v).strip() for v in row.tolist()]
                    print(f"Row {rx} | {row_list[2]} | {row_list[3]} | 가입금액: {row_list[6]} | 보험료: {row_list[7]}")
                    print(f"  설명: {row_list[28][:120]}...")
                
                print("\n=== 교보라플 정기보험 ===")
                for rx, row in kb_rows.iterrows():
                    row_list = [str(v).strip() for v in row.tolist()]
                    print(f"Row {rx} | {row_list[2]} | {row_list[3]} | 가입금액: {row_list[6]} | 보험료: {row_list[7]}")
                    print(f"  설명: {row_list[28][:120]}...")
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
