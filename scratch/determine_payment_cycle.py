import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

def get_payment_cycle(row):
    # Check all columns for payment cycle indicators
    row_str = " ".join([str(val) for val in row.values if pd.notna(val)])
    
    # We want to check details specifically if there is a column for details (e.g. '원본_열_28' or '원본_열_23')
    # If the text has '연납', it's annual. If it has '월납', it's monthly.
    # Let's prioritize '연납' or '월납' check.
    if '연납' in row_str:
        return 'annual'
    elif '월납' in row_str:
        return 'monthly'
    elif '일시납' in row_str:
        return 'single'
    else:
        # Default fallback
        return 'unknown'

df['detected_cycle'] = df.apply(get_payment_cycle, axis=1)

print("Detected cycles count:")
print(df['detected_cycle'].value_counts())

print("\nSamples of detected 'annual' (first 10):")
annual_samples = df[df['detected_cycle'] == 'annual'].head(10)
for i, row in annual_samples.iterrows():
    print(f"- {row['상품명']} | Premium: {row['기준보험료']} | file: {row['source_file']}")

print("\nSamples of detected 'monthly' (first 10):")
monthly_samples = df[df['detected_cycle'] == 'monthly'].head(10)
for i, row in monthly_samples.iterrows():
    print(f"- {row['상품명']} | Premium: {row['기준보험료']} | file: {row['source_file']}")
