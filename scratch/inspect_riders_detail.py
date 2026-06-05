import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv"
df = pd.read_csv(csv_path, encoding='utf-8-sig')

# Group by company and product to see how many rows each product has
grouped = df.groupby(['보험회사', '상품명']).size().reset_index(name='count')
print("--- Products and their row counts in extracted_data.csv ---")
print(grouped.head(15))

# Let's pick a product with many rows, for example one from 메리츠화재 or 삼성화재 or DB손보
print("\n--- Detail of riders for a sample product (e.g. Meritz) ---")
meritz_df = df[df['보험회사'] == '메리츠화재']
if not meritz_df.empty:
    sample_prod = meritz_df['상품명'].iloc[0]
    prod_details = df[df['상품명'] == sample_prod]
    print(f"Product: {sample_prod} (Total rows: {len(prod_details)})")
    
    # Select key columns
    cols = ['담보명(급부명)', '지급금액', '가입금액', '기준보험료', '가입보험료']
    print(prod_details[cols].to_string(index=False))

print("\n--- Let's search for '교통사고처리지원금' to see the coverage amounts and premiums in the CSV ---")
traffic_df = df[df['담보명(급부명)'].str.contains('교통사고처리지원금|형사합의', na=False, case=False)]
print(f"Total rows matching Traffic Accident Rider: {len(traffic_df)}")
print(traffic_df[['보험회사', '상품명', '담보명(급부명)', '가입금액', '기준보험료', '가입보험료']].head(20).to_string(index=False))
