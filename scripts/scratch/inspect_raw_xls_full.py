import os
import pandas as pd
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')

FILEPATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\보장성_상품비교_20260608162037508.xls"

if not os.path.exists(FILEPATH):
    print("[-] File not found")
    sys.exit(1)

with open(FILEPATH, 'rb') as f:
    raw_bytes = f.read()

frames = None
for enc in ['cp949', 'euc-kr', 'utf-8']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                break
    except Exception as e:
        continue

df = frames[0]

print("=== 흥국생명 온라인정기보험 ROWS ===")
for idx, row in df.iterrows():
    row_list = [str(v).strip() for v in row.tolist()]
    company = row_list[0] if len(row_list) > 0 else ""
    product_name = row_list[1] if len(row_list) > 1 else ""
    
    if "흥국생명" in company and "온라인정기보험" in product_name:
        print(f"\nRow {idx}: {row_list[0]} | {row_list[1]} | {row_list[2]} | {row_list[3]}")
        for col_idx, val in enumerate(row_list):
            if val != 'nan' and val != '-':
                print(f"  Col {col_idx}: {val}")
        print("-" * 50)
