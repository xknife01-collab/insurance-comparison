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
                
                # Check products
                products = [
                    "라이프UP 정기보험",
                    "헤리티지 정기보험",
                    "온라인정기보험_1종",
                    "온라인정기보험_2종",
                    "교보라플 정기보험"
                ]
                
                print("=== 상품별 갱신 여부 및 40세 남성 주계약 보험료 ===")
                for prod in products:
                    rows = df[df.iloc[:, 1].str.contains(prod, na=False) & (df.iloc[:, 2] == '주계약')]
                    for rx, row in rows.iterrows():
                        row_list = [str(v).strip() for v in row.tolist()]
                        print(f"Prod: {row_list[1]} | Detail: {row_list[3]} | Type: {row_list[24]} | Prem: {row_list[7]}")
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
