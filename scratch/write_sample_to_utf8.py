# -*- coding: utf-8 -*-
import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.csv", encoding='utf-8-sig')

with open("scratch/sample_check.txt", "w", encoding="utf-8") as f:
    for idx, row in df.head(3).iterrows():
        f.write(f"Row {idx}:\n")
        f.write(f"  Company: {row['보험회사']}\n")
        f.write(f"  Product: {row['상품명']}\n")
        f.write(f"  Coverage: {row['담보명(급부명)']}\n")
        f.write(f"  Male Premium: {row['기준보험료']}\n")
        f.write(f"  Female Premium: {row['가입보험료']}\n")
        f.write("\n")
