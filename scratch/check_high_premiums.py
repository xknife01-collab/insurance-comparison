import pandas as pd

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

# Find rows where male_premium_40 or female_premium_40 is greater than 100,000 KRW
high_male = df[df['male_premium_40'] > 50000]
high_female = df[df['female_premium_40'] > 50000]

# Combine and drop duplicates
high_df = pd.concat([high_male, high_female]).drop_duplicates()

print(f"Total rows in CSV: {len(df)}")
print(f"Number of rows with premium > 50,000 KRW: {len(high_df)}")
print("\n--- Detailed list of high premium products ---")
for idx, row in high_df.iterrows():
    print(f"Company: {row['company']}")
    print(f"Product Name: {row['product_name']}")
    print(f"Sub Type: {row['sub_type']}")
    print(f"Male 40: {row['male_premium_40']:,} KRW")
    print(f"Female 40: {row['female_premium_40']:,} KRW")
    print(f"Declared Rate: {row['declared_rate']}, Business Fee: {row['business_fee']}")
    print("-" * 50)
