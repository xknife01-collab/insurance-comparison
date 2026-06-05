import pandas as pd

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

# Print headers
print("CSV Headers:")
print(list(df.columns))

# Filter for rows where sub_type is term_pure
pure_term = df[df['sub_type'] == 'term_pure']

print(f"\nTotal rows in term_pure: {len(pure_term)}")
print("\n--- Raw Sample Rows from term_pure ---")
for idx, row in pure_term.head(15).iterrows():
    print(f"Company: {row.get('보험회사')}")
    print(f"Product: {row.get('상품명')}")
    print(f"Gubun: {row.get('구분')}")
    print(f"Amount (가입금액): {row.get('가입금액')}")
    print(f"Male (기준보험료): {row.get('기준보험료')}")
    print(f"Female (가입보험료): {row.get('가입보험료')}")
    
    # Print any other column that is not empty
    non_empty = {}
    for col in df.columns:
        if pd.notna(row[col]) and str(row[col]).strip() != "" and col not in ['보험회사', '상품명', '구분', '기준보험료', '가입보험료', 'sub_type']:
            non_empty[col] = row[col]
    print(f"Other fields: {non_empty}")
    print("-" * 50)
