# -*- coding: utf-8 -*-
import pandas as pd

def inspect():
    df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv")
    print("=== Unique Products ===")
    for p in df["상품명"].unique():
        print(p)
        
    print("\n=== Details of some products ===")
    for p in df["상품명"].unique()[:5]:
        p_df = df[df["상품명"] == p]
        desc = p_df.iloc[0]["상세안내"]
        print(f"Product: {p}\nDetail: {desc[:200]}\n")

if __name__ == "__main__":
    inspect()
