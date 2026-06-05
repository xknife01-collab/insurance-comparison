import pandas as pd
import numpy as np

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

# Clean premium helper
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

# Filter for pure term products in the 10만원대 range (50,000 to 300,000 KRW)
pure_term = df[df['sub_type'] == 'term_pure']
high_pure_term = pure_term[
    ((pure_term['male_premium'] >= 50000) & (pure_term['male_premium'] <= 350000)) |
    ((pure_term['female_premium'] >= 50000) & (pure_term['female_premium'] <= 350000))
]

print(f"Total term_pure rows in CSV: {len(pure_term)}")
print(f"Number of rows with premium between 50k and 350k KRW: {len(high_pure_term)}")

print("\n--- List of term_pure rows in the 10만원대 range ---")
cols_to_print = ['보험회사', '상품명', '구분', '기준보험료', '가입보험료', '가입금액']
for idx, row in high_pure_term[cols_to_print].drop_duplicates().head(30).iterrows():
    print(f"Company: {row['보험회사']}")
    print(f"Product Name: {row['상품명']}")
    print(f"Gubun: {row['구분']}")
    print(f"Male Premium (기준보험료): {row['기준보험료']}")
    print(f"Female Premium (가입보험료): {row['가입보험료']}")
    print(f"Amount (가입금액): {row['가입금액']}")
    print("-" * 50)
