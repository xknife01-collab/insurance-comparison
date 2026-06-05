import pandas as pd
import re

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

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

print("--- Simulated Monthly Premiums for High-Premium Pure Term Products ---")
high_df = df[
    (df['sub_type'] == 'term_pure') & 
    ((df['male_premium'] >= 50000) | (df['female_premium'] >= 50000))
]

for idx, row in high_df[['보험회사', '상품명', '구분', '기준보험료', '가입보험료']].drop_duplicates().iterrows():
    raw_male = clean_val(row['기준보험료'])
    raw_female = clean_val(row['가입보험료'])
    
    monthly_male = raw_male / 12 if raw_male >= 50000 else raw_male
    monthly_female = raw_female / 12 if raw_female >= 50000 else raw_female
    
    print(f"Company: {row['보험회사']}")
    print(f"Product: {row['상품명']}")
    print(f"Raw Male Premium: {raw_male:,.0f} KRW  ->  Simulated Monthly Male: {monthly_male:,.0f} KRW")
    print(f"Raw Female Premium: {raw_female:,.0f} KRW  ->  Simulated Monthly Female: {monthly_female:,.0f} KRW")
    print("-" * 70)
