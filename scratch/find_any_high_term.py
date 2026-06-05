import pandas as pd

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

import re
def clean_val(val):
    if pd.isna(val):
        return 0
    val_str = str(val).strip()
    match = re.search(r'[\d,.]+', val_str)
    if match:
        clean = match.group(0).replace(',', '')
        try:
            return float(clean)
        except:
            return 0
    return 0

df['male_premium'] = df['기준보험료'].apply(clean_val)
df['female_premium'] = df['가입보험료'].apply(clean_val)

high_df = df[
    ((df['male_premium'] >= 50000) & (df['male_premium'] <= 500000)) |
    ((df['female_premium'] >= 50000) & (df['female_premium'] <= 500000))
]

print(f"Total rows in CSV: {len(df)}")
print(f"Number of rows with premium between 50k and 500k KRW: {len(high_df)}")

print("\n--- Detailed list of high premium products in the entire CSV ---")
cols = ['보험회사', '상품명', '구분', '가입금액', '기준보험료', '가입보험료', '적용이율', 'sub_type', 'source_file']
for idx, row in high_df[cols].drop_duplicates().head(50).iterrows():
    print(f"Company: {row['보험회사']}")
    print(f"Product Name: {row['상품명']}")
    print(f"Gubun: {row['구분']}")
    print(f"Sub Type: {row['sub_type']}")
    print(f"Amount (가입금액): {row['가입금액']}")
    print(f"Male Premium (기준보험료): {row['기준보험료']}")
    print(f"Female Premium (가입보험료): {row['가입보험료']}")
    print(f"Rate: {row['적용이율']}")
    print(f"Source File: {row['source_file']}")
    print("-" * 50)
