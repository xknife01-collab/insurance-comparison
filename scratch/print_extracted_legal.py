# -*- coding: utf-8 -*-
import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.csv", encoding='utf-8-sig')

# Deduplicate by product and coverage (since file_47.xls and the Korean-named file are duplicates, we have duplicate rows)
df_unique = df.drop_duplicates(subset=["보험회사", "상품명", "담보명(급부명)"])

print("--- Extracted Legal Insurance Products & Premiums ---")
for idx, row in df_unique.iterrows():
    company = row["보험회사"]
    product = row["상품명"]
    coverage = row["담보명(급부명)"]
    male = row["기준보험료"] if pd.notna(row["기준보험료"]) and str(row["기준보험료"]).strip() else "-"
    female = row["가입보험료"] if pd.notna(row["가입보험료"]) and str(row["가입보험료"]).strip() else "-"
    
    print(f"[{company}] {product}")
    print(f"  * 담보명: {coverage}")
    print(f"  * 남성 보험료: {male}")
    print(f"  * 여성 보험료: {female}")
    print("-" * 50)
