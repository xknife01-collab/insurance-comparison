import os
import io
import pandas as pd
import re

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_11.xls"

with open(filepath, 'rb') as f:
    raw_bytes = f.read()

for enc in ['cp949', 'euc-kr', 'utf-8']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                break
    except Exception:
        continue

matching = df[df.map(lambda x: any(k in str(x) for k in ["변액", "정기"])).any(axis=1)]

with open("scripts/scratch/inspect_all_cycles_notes.txt", "w", encoding="utf-8") as f:
    f.write("Cycles & Notes in file_11.xls:\n")
    for idx, row in matching.iterrows():
        product_name = row.iloc[1]
        col28 = row.iloc[28] if len(row) > 28 else ""
        col29 = row.iloc[29] if len(row) > 29 else ""
        
        # Search for payment cycle keywords in col28
        cycle_info = []
        if "월납" in str(col28): cycle_info.append("월납")
        if "연납" in str(col28): cycle_info.append("연납")
        if "일시납" in str(col28): cycle_info.append("일시납")
        if "년납" in str(col28):
            matches = re.findall(r'\d+년납', str(col28))
            if matches:
                cycle_info.extend(matches)
                
        f.write(f"\nRow {idx} | Product: {product_name}\n")
        f.write(f"  Col 7 (기준): {row.iloc[7]} | Col 8 (가입): {row.iloc[8]}\n")
        f.write(f"  Detected cycles keywords: {cycle_info}\n")
        f.write(f"  Col 28: {col28}\n")
        f.write("-" * 80 + "\n")
