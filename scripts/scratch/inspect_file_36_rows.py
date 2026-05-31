import pandas as pd

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\pension\extracted_data.csv'
df = pd.read_csv(csv_path)

f36_rows = df[df['source_file'] == 'file_36.xls']

with open(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\file_36_rows_inspect.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total rows for file_36.xls: {len(f36_rows)}\n\n")
    # Write first 5 rows with column names
    for idx, row in f36_rows.head(5).iterrows():
        f.write(f"Row {idx}:\n")
        for col in df.columns:
            f.write(f"  {col}: {row[col]}\n")
        f.write("-" * 40 + "\n")
