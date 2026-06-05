# -*- coding: utf-8 -*-
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"
df = pd.read_excel(filepath, header=None)

terms = ["월납", "연납", "일시납", "1년납", "연기준", "월기준", "납입주기", "납입기간"]
matches = []

for idx, row in df.iterrows():
    row_str = " ".join([str(v) for v in row.tolist() if pd.notna(v)])
    for t in terms:
        if t in row_str:
            matches.append((idx, t, row_str))

with open("scratch/payment_info.txt", "w", encoding="utf-8") as out:
    for idx, t, r_str in matches:
        out.write(f"Row {idx} (matched '{t}'): {r_str[:200]}\n")

print(f"Done. Matches: {len(matches)}")
