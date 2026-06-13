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
                
                # Let's find the headers
                # We search the first 10 rows for the row containing "보험회사" or "상품명"
                header_row_idx = 0
                for i in range(min(10, len(df))):
                    row_vals = [str(v) for v in df.iloc[i].tolist()]
                    if any("보험회사" in val or "상품명" in val or "회사명" in val for val in row_vals):
                        header_row_idx = i
                        break
                
                headers = [str(v).strip().replace("\n", " ") for v in df.iloc[header_row_idx].tolist()]
                
                hk_rows = df[df.iloc[:, 1].str.contains("온라인정기보험", na=False)]
                
                print(f"=== 흥국생명 온라인정기보험 엑셀 상세 데이터 (총 {len(hk_rows)}개 행) ===")
                for rx, row in hk_rows.iterrows():
                    print(f"\n[행 번호: {rx}]")
                    row_list = row.tolist()
                    for cx, val in enumerate(row_list):
                        val_str = str(val).strip()
                        if val_str and val_str != "nan" and val_str != "-":
                            header_name = headers[cx] if cx < len(headers) else f"열_{cx}"
                            if not header_name or header_name == "nan":
                                header_name = f"열_{cx}"
                            print(f"  * {header_name} (Col {cx}): {val_str}")
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
