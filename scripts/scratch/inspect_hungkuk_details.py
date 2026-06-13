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
        
    for idx, row in df.iterrows():
        row_list = [clean_val(v) for v in row.tolist()]
        row_str = " ".join(row_list)
        if "흥국생명" in row_str and "처음만난" in row_str:
            non_empty = [f"Col{i}:{val}" for i, val in enumerate(row_list) if val]
            print(f"Row {idx}: {' | '.join(non_empty)}")

if __name__ == '__main__':
    inspect()
