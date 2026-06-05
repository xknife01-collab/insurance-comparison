import os
import pandas as pd
import re

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

# Add numeric column for sorting
df['male_numeric'] = df['기준보험료'].apply(extract_number)
df['female_numeric'] = df['가입보험료'].apply(extract_number)

# Filter out rows with 0 premium
df_filtered = df[(df['male_numeric'] > 0) | (df['female_numeric'] > 0)].copy()

# Deduplicate by company and product name (keeping the one with the lowest male premium if there are duplicates)
df_dedup = df_filtered.sort_values(by='male_numeric').drop_duplicates(subset=['보험회사', '상품명'], keep='first')

# Sort by male premium ascending
df_sorted = df_dedup.sort_values(by='male_numeric', ascending=True)

print("| 번호 | 보험회사 | 상품명 | 남성 보험료 (월납 환산) | 여성 보험료 (월납 환산) |")
print("| --- | --- | --- | :---: | :---: |")
count = 1
for idx, row in df_sorted.iterrows():
    male_str = row['기준보험료'] if pd.notna(row['기준보험료']) and str(row['기준보험료']).strip() else "-"
    female_str = row['가입보험료'] if pd.notna(row['가입보험료']) and str(row['가입보험료']).strip() else "-"
    print(f"| {count} | {row['보험회사']} | {row['상품명']} | {male_str} | {female_str} |")
    count += 1
