import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_csv("insurance_data/5_savings/variable_term/extracted_data.csv")
term_df = df[df['sub_type'].isin(['term_pure', 'term_ceo', 'variable_term'])]
unique_products = term_df.drop_duplicates(subset=['보험회사', '상품명'])

print(f"Total unique term products: {len(unique_products)}")
for idx, row in unique_products.iterrows():
    company = row['보험회사']
    pname = row['상품명']
    desc = str(row['상세안내'])
    
    cycle = "unknown"
    if "월납" in desc:
        cycle = "monthly (월납)"
    elif "연납" in desc:
        cycle = "annual (연납)"
    elif "일시납" in desc:
        cycle = "single (일시납)"
        
    print(f"Company: {company} | Prod: {pname} | Cycle: {cycle}")
