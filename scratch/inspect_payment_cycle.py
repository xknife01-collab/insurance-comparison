import os
import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')
html_df = df[df['file_type'] == 'html']
print('Total HTML rows:', len(html_df))

# Let's find unique files and sample their rows to check how payment cycle is specified
unique_files = html_df['source_file'].unique()
for filename in unique_files:
    file_rows = html_df[html_df['source_file'] == filename]
    print(f"\nSource File: {filename} (Total rows: {len(file_rows)})")
    # print headers/values for the first row of this file
    sample = file_rows.iloc[0]
    print("  Product:", sample['상품명'])
    print("  Premium:", sample['기준보험료'])
    # Find columns that might contain "월납", "연납", "연", "월", "일시납"
    for col in sample.index:
        val_str = str(sample[col])
        if any(k in val_str for k in ["월납", "연납", "일시납", "매월", "매년", "연기준"]):
            print(f"    Col '{col}': {val_str}")
