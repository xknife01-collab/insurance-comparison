import pandas as pd
import io
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

files = [f for f in os.listdir("..") if f.endswith(".xls") and "보장성_상품비교" in f and not "변액" in f]
if not files:
    print("No matching files found")
    sys.exit(1)

target_prods = [
    "흥국생명 온라인정기보험_2종",
    "푸본현대 원패스 정기보험",
    "교보라플 정기보험",
    "가족사랑정기보험",
    "라이프UP 정기보험",
    "헤리티지 정기보험"
]

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
                    for rx, row in df.iterrows():
                        row_list = [str(v).strip() for v in row.tolist()]
                        if len(row_list) > 1:
                            pname = row_list[1]
                            if any(tp in pname for tp in target_prods):
                                print(f"[{fname}] Row {rx} | Company: {row_list[0]} | Prod: {pname}")
                                print(f"  Col 2 (Gubun): {row_list[2]}")
                                print(f"  Col 5 (Benefit): {row_list[5]}")
                                print(f"  Col 6 (Amount): {row_list[6]}")
                                print(f"  Col 7 (Premium): {row_list[7]}")
                                print(f"  Col 8 (Premium 2): {row_list[8]}")
                                print(f"  Col 28 (Desc): {row_list[28] if len(row_list) > 28 else 'N/A'}")
            break
        except Exception:
            continue
