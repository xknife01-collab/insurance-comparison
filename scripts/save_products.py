import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except:
        df = pd.read_csv(csv_path, encoding='cp949')

    df_filtered = df[~df['상품명'].str.contains('치매|CDR', case=False, na=False)]
    
    care_keywords = '간병|간병인|요양|재가|시설|장기요양'
    df_care = df_filtered[
        df_filtered['상품명'].str.contains(care_keywords, case=False, na=False) |
        df_filtered['담보명(급부명)'].str.contains(care_keywords, case=False, na=False)
    ]
    
    unique_products = df_care['상품명'].dropna().unique()
    
    with open('all_care_products.txt', 'w', encoding='utf-8') as f:
        f.write(f"Total Unique Products: {len(unique_products)}\n\n")
        for idx, prod in enumerate(unique_products):
            prod_df = df_care[df_care['상품명'] == prod]
            company = prod_df['보험회사'].iloc[0]
            f.write(f"[{idx+1}] {company} - {prod}\n")
            # Get unique riders
            riders = prod_df['담보명(급부명)'].dropna().unique()
            for r in riders[:3]:
                f.write(f"  * {r}\n")
            f.write("\n")

if __name__ == "__main__":
    run()
