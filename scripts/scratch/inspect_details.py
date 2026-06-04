# -*- coding: utf-8 -*-
import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"

def inspect_details():
    df = pd.read_csv(CSV_PATH)
    
    # We want to see how main contracts and riders are priced.
    # Group by 상품명, 구분, 담보명, 기준보험료, 가입보험료
    print("=== Shinhan Life ===")
    shinhan = df[df["보험회사"] == "신한라이프생명"]
    for idx, row in shinhan.iterrows():
        print(f"[{row['구분']}] {row['담보명(급부명)']} | 남: {row['기준보험료']} | 여: {row['가입보험료']}")
        
    print("\n=== Hana Life ===")
    hana = df[df["보험회사"] == "하나생명"]
    for idx, row in hana.iterrows():
         print(f"[{row['구분']}] {row['담보명(급부명)']} | 남: {row['기준보험료']} | 여: {row['가입보험료']}")

    print("\n=== MetLife ===")
    metlife = df[df["보험회사"] == "메트라이프생명"].head(10)
    for idx, row in metlife.iterrows():
         print(f"[{row['구분']}] {row['담보명(급부명)']} | 남: {row['기준보험료']} | 여: {row['가입보험료']}")

if __name__ == "__main__":
    inspect_details()
