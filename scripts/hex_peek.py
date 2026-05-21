import pandas as pd
import os

f = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data\file_47.xls'
try:
    df = pd.read_excel(f, engine='xlrd', header=None)
    for idx, row in df.iterrows():
        s = str(row[1])
        if len(s) > 1 and idx > 1200:
            print(f"ROW {idx}: {s} | HEX: {s.encode('utf-8', 'ignore').hex()}")
            if idx > 1250: break
except Exception as e:
    print(f"[ERR] {e}")
