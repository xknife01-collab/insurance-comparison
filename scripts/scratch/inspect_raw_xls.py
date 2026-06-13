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

# Target companies
targets = ["흥국생명", "푸본현대생명", "신한라이프생명", "한화생명"]

print("=== SPECIFIC COMPANIES RAW ROWS ===")
for idx, row in df.iterrows():
    row_list = [str(v).strip() for v in row.tolist()]
    company = row_list[0] if len(row_list) > 0 else ""
    product_name = row_list[1] if len(row_list) > 1 else ""
    
    if any(t in company for t in targets) and any(k in product_name for k in ["정기보험", "SOL정기보험", "e정기보험"]):
        classification = row_list[2] if len(row_list) > 2 else ""
        담보명 = row_list[3] if len(row_list) > 3 else ""
        가입금액 = row_list[6] if len(row_list) > 6 else ""
        기준보험료 = row_list[7] if len(row_list) > 7 else ""
        가입보험료 = row_list[8] if len(row_list) > 8 else ""
        
        print(f"[{company}] {product_name} | 구분: {classification} | 담보명: {담보명} | 가입금액: {가입금액} | 기준보험료: {기준보험료} | 가입보험료: {가입보험료}")
        print(f"  Col 9-15: {row_list[9:15]}")
        print("-" * 80)
