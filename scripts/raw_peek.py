import pandas as pd
import os

f = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\file_47.xls'
print(f"[*] Raw Peek into {f}")
try:
    df = pd.read_excel(f, engine='xlrd', header=None)
    count = 0
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.tolist()])
        if any(k in row_str for k in ['Ｚ', '޸', '삼성', '메리츠']):
            prems = []
            for v in row:
                try:
                    s = str(v).replace(',', '').split('.')[0]
                    if s.isdigit() and 10000 < int(s) < 200000:
                        prems.append(s)
                except: continue
            
            if len(prems) >= 2:
                print(f"  [FOUND] {row_str[:50]}... PREMS: {prems}")
                count += 1
                if count >= 10: break
    print(f"[*] Peek Done. Matches: {count}")
except Exception as e:
    print(f"  [ERROR] {e}")
