import pandas as pd
import re

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(csv_path)

# Let's see what unique product names exist
unique_products = df["상품명"].dropna().unique()

print(f"Total Unique Products: {len(unique_products)}")
print("\nProducts containing '간병' or '요양':")
care_prods = []
for p in unique_products:
    if "간병" in p or "요양" in p:
        # Check exclusion
        is_ex = re.search(r"건강보험|종합보험|암보험|운전자|뇌혈관|심장|치매|CDR", p)
        status = "EXCLUDED" if is_ex else "VALID"
        print(f"- [{status}] {p}")
        if status == "VALID":
            care_prods.append(p)

print(f"\nTotal VALID care products: {len(care_prods)}")
