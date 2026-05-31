import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except:
        df = pd.read_csv(csv_path, encoding='cp949')

    # Filter out products containing "치매" or "CDR"
    df_filtered = df[~df['상품명'].str.contains('치매|CDR', case=False, na=False)]
    
    # Filter products/riders containing caregiving keywords
    care_keywords = '간병|간병인|요양|재가|시설|장기요양'
    df_care = df_filtered[
        df_filtered['상품명'].str.contains(care_keywords, case=False, na=False) |
        df_filtered['담보명(급부명)'].str.contains(care_keywords, case=False, na=False)
    ]
    
    # Find unique products and show key details
    unique_products = df_care['상품명'].dropna().unique()
    print(f"Total Unique Pure Caregiving Products Found: {len(unique_products)}")
    
    # Group by product and show the main rider info and premiums
    product_details = []
    for idx, prod in enumerate(unique_products):
        prod_df = df_care[df_care['상품명'] == prod]
        company = prod_df['보험회사'].iloc[0]
        
        # Get riders and premiums
        riders_info = []
        for _, row in prod_df.iterrows():
            r_name = row['담보명(급부명)']
            b_prem = str(row['기준보험료']).strip() if pd.notna(row['기준보험료']) else '0'
            p_prem = str(row['가입보험료']).strip() if pd.notna(row['가입보험료']) else '0'
            riders_info.append(f"    - {r_name} (기준: {b_prem} / 가입: {p_prem})")
            
        print(f"\n[{idx + 1}] {company} - {prod}")
        for r_info in riders_info[:5]: # Show up to 5 riders per product
            print(r_info)
        if len(riders_info) > 5:
            print(f"    ...외 {len(riders_info) - 5}개 특약 더 있음")

if __name__ == "__main__":
    run()
