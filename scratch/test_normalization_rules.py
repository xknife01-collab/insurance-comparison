import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')

def test_normalize(row):
    # Check all cells in the row for '연납'
    row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
    
    import re
    raw_prem = str(row['기준보험료']).replace(',', '')
    num_str = "".join(re.findall(r'\d+', raw_prem))
    try:
        premium = float(num_str)
    except:
        premium = 0.0
        
    is_annual = '연납' in row_str
    
    normalized_prem = premium
    if is_annual:
        normalized_prem = premium / 12.0
        
    return pd.Series({
        'is_annual': is_annual,
        'normalized_prem': normalized_prem
    })

df[['is_annual', 'normalized_prem']] = df.apply(test_normalize, axis=1)
df = df[df['normalized_prem'] > 0]
term_pure = df[(df['sub_type'] == 'term_pure') & (df['구분'] == '주계약')]
# Group by product name and get the minimum male base premium
# Note: we need to look at how upload_variable_term_rates.ts grouped them.
# It grouped by product_name, company_name, and sub_type, and calculated the min/max premium for age 40.

# Let's run a quick simulation of the grouping
grouped = term_pure.groupby(['상품명', '보험회사']).agg({
    'is_annual': 'first',
    '기준보험료': 'first',
    'normalized_prem': 'min'
}).reset_index()

# Sort by normalized premium ascending
grouped = grouped.sort_values(by='normalized_prem')

print("Top 20 Term Pure Products with new normalization logic:")
for idx, row in grouped.head(20).iterrows():
    # Calculate premium for age 44 (age factor 1.36)
    prem_44 = round((row['normalized_prem'] * 1.36) / 100) * 100
    print(f"- {row['보험회사']} | {row['상품명']} | Raw: {row['기준보험료']} | Annual: {row['is_annual']} | Base: {row['normalized_prem']:.1f} | Age 44: {prem_44:,}원")
