import os
import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure\extracted_data.csv"
df = pd.read_csv(csv_path)

seen = set()
unique_rows = []

for idx, row in df.iterrows():
    company = row["보험회사"]
    product = row["상품명"]
    prem = row["기준보험료"]
    if pd.isna(prem) or str(prem).strip() == "" or str(prem).strip() == "-":
        prem = row["가입보험료"]
    
    prem_val = str(prem).strip()
    if pd.isna(company) or pd.isna(product):
        continue
        
    key = (company, product, prem_val)
    if key not in seen:
        seen.add(key)
        unique_rows.append({
            "보험회사": company,
            "상품명": product,
            "보험료": prem_val if prem_val and prem_val != "nan" else "정보 없음"
        })

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\read_golf_excel_out.txt"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("| 연번 | 보험회사 | 상품명 | 보험료 |\n")
    f.write("| :--- | :--- | :--- | :--- |\n")
    for i, r in enumerate(unique_rows, 1):
        f.write(f"| {i} | {r['보험회사']} | {r['상품명']} | {r['보험료']} |\n")

print("Done!")
