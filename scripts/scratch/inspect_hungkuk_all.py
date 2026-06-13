# -*- coding: utf-8 -*-
import os
import pandas as pd
import warnings
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\보장성_상품비교_20260608162059302.xls"

def load_df(filepath):
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0]
            except:
                continue
    except:
        pass
    return None

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def inspect():
    df = load_df(filepath)
    if df is None:
        return
        
    count = 0
    for idx, row in df.iterrows():
        row_list = [clean_val(v) for v in row.tolist()]
        if "(무)처음만난흥국생명상해보험" in row_list[1]:
            count += 1
            print(f"Row {idx} | Col3: {row_list[3]} | Col6: {row_list[6]} | Col7: {row_list[7]} | Col8: {row_list[8]} | Col24: {row_list[24][:80]}")
    print("Total rows:", count)

if __name__ == '__main__':
    inspect()
