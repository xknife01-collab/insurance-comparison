import os
import pandas as pd
import re
import numpy as np

TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident"
combined_xlsx = os.path.join(TARGET_DIR, "extracted_data_combined.xlsx")

df = pd.read_excel(combined_xlsx)

def extract_number(val_str):
    if pd.isna(val_str):
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s:
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

df['male_numeric'] = df['기준보험료'].apply(extract_number)
df['female_numeric'] = df['가입보험료'].apply(extract_number)

df_valid = df[(df['male_numeric'] > 0) & (df['female_numeric'] > 0)].copy()

df_valid['ratio'] = df_valid['male_numeric'] / df_valid['female_numeric']

print("Average ratio (Male / Female):", df_valid['ratio'].mean())
print("Median ratio (Male / Female):", df_valid['ratio'].median())

# Group by company and see average ratio
print("\nCompany-wise Average Ratio:")
print(df_valid.groupby('보험회사')['ratio'].mean())

# Print some samples
print("\nSamples:")
for idx, row in df_valid.head(10).iterrows():
    print(f"  {row['보험회사']} | {row['상품명']}: 남 {row['기준보험료']} / 여 {row['가입보험료']} -> 비율 {row['ratio']:.2f}배")
