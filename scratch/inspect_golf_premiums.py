import os
import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure\extracted_data.csv")

unique_products = {}
for idx, row in df.iterrows():
    company = row["보험회사"]
    product = row["상품명"]
    prem = row["기준보험료"]
    if pd.isna(prem) or str(prem).strip() == "" or str(prem).strip() == "-":
        prem = row["가입보험료"]
    
    if pd.isna(prem) or str(prem).strip() == "" or str(prem).strip() == "-":
        continue
        
    prem_str = str(prem).replace("원", "").replace(",", "").replace(" ", "").strip()
    try:
        num = int(float(prem_str))
        if num > 0:
            key = (company, product)
            if key not in unique_products or num < unique_products[key]:
                unique_products[key] = num
    except Exception:
        continue

output_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\golf_products_ts.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("export const GOLF_PRODUCTS: GolfProduct[] = [\n")
    for (company, product), premium in unique_products.items():
        f.write(f"  {{ company: '{company}', productName: '{product}', basePremium: {premium} }},\n")
    f.write("];\n")

print("Done! Wrote to scratch/golf_products_ts.txt")
