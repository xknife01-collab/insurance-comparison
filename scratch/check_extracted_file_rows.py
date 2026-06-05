import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')
print("Unique source files in CSV:")
print(df['source_file'].value_counts())

# Check for files containing the word "변액" or "정기" in their names
for f in df['source_file'].unique():
    subset = df[df['source_file'] == f]
    # Check if '연납' is present in this subset
    has_yeonnap = subset.astype(str).apply(lambda row: row.str.contains('연납').any(), axis=1).any()
    print(f"File: {f} | Rows: {len(subset)} | Has '연납': {has_yeonnap}")
