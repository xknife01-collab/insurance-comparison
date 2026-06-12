import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

# Let's print unique companies and their products with premiums
unique_products = df.drop_duplicates(subset=['보험회사', '상품명', '구분'])
print(f"Total unique products/divisions: {len(unique_products)}")
for idx, r in unique_products.iterrows():
    # Find male premiums for this product/division
    prod_rows = df[(df['보험회사'] == r['보험회사']) & (df['상품명'] == r['상품명']) & (df['구분'] == r['구분'])]
    premiums = []
    for _, pr in prod_rows.iterrows():
        try:
            val = float(str(pr['남성보험료']).replace(",", "").replace("원", "").strip())
            if val > 0:
                premiums.append(val)
        except:
            pass
    if premiums:
        max_p = max(premiums)
        min_p = min(premiums)
        print(f"Co: {r['보험회사']} | Prod: {r['상품명']} | Div: {r['구분']} | Prem range: {min_p} ~ {max_p}")
    else:
        print(f"Co: {r['보험회사']} | Prod: {r['상품명']} | Div: {r['구분']} | No premium")
