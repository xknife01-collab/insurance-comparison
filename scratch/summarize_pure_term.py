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

pure_term = df[df['sub_type'] == 'term_pure']

print(f"Total rows in term_pure: {len(pure_term)}")
print(f"Min Male Premium: {pure_term['male_premium'].min():,}")
print(f"Max Male Premium: {pure_term['male_premium'].max():,}")
print(f"Min Female Premium: {pure_term['female_premium'].min():,}")
print(f"Max Female Premium: {pure_term['female_premium'].max():,}")

print("\n--- Top 30 unique products in term_pure and their premium ranges ---")
grouped = pure_term.groupby(['보험회사', '상품명']).agg(
    min_male=('male_premium', 'min'),
    max_male=('male_premium', 'max'),
    min_female=('female_premium', 'min'),
    max_female=('female_premium', 'max'),
    count=('상품명', 'count')
).reset_index()

for idx, row in grouped.iterrows():
    print(f"Company: {row['보험회사']}")
    print(f"Product Name: {row['상품명']}")
    print(f"Male Premium Range: {row['min_male']:,} ~ {row['max_male']:,} KRW")
    print(f"Female Premium Range: {row['min_female']:,} ~ {row['max_female']:,} KRW")
    print(f"Rows Count: {row['count']}")
    print("-" * 50)
