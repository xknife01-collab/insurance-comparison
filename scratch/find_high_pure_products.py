import pandas as pd

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

def clean_val(val):
    if pd.isna(val):
        return 0
    val_str = str(val).replace(',', '').strip()
    try:
        return float(val_str)
    except:
        return 0

df['male_premium'] = df['기준보험료'].apply(clean_val)
df['female_premium'] = df['가입보험료'].apply(clean_val)

# Filter for pure term or variable term products in the CSV with high premiums
high_df = df[
    (df['sub_type'].isin(['term_pure', 'variable_term'])) & 
    ((df['male_premium'] >= 50000) | (df['female_premium'] >= 50000))
]

print(f"Number of high-premium rows: {len(high_df)}")
print("\n--- Detailed list of high premium term_pure / variable_term products ---")
cols = ['보험회사', '상품명', '구분', '가입금액', '기준보험료', '가입보험료', '적용이율', 'source_file', 'sub_type']
for idx, row in high_df[cols].drop_duplicates().iterrows():
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
