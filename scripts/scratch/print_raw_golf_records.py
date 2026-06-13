# -*- coding: utf-8 -*-
import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure\extracted_data.csv"

def inspect():
    df = pd.read_csv(CSV_PATH)
    for idx, r in df.iterrows():
        prod = str(r.get("상품명"))
        if "오잘공" in prod or "홀인원보험" in prod:
            print(f"Row {idx} | Prod: {prod} | 구분: {r.get('구분')} | 담보: {r.get('담보명(급부명)')} | 지급금액: {r.get('지급금액')} | 가입금액: {r.get('가입금액')} | 기준: {r.get('기준보험료')}")

if __name__ == '__main__':
    inspect()
