# -*- coding: utf-8 -*-
import os
import pandas as pd
import warnings
import sys

sys.stdout.reconfigure(encoding='utf-8')
warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\장기보장성 비교 공시 (7).xls"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception as e:
        print("Error reading:", e)
    return None

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def inspect():
    df = load_df(filepath)
    if df is None:
        return
        
    row_2463 = df.iloc[2463].tolist()
    print("Row 2463 columns:")
    for i, col in enumerate(row_2463):
        print(f"  Col {i}: {clean_val(col)}")
        
if __name__ == '__main__':
    inspect()
