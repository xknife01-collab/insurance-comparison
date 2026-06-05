import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')
heritage = df[df['source_file'].str.contains('1.xls', na=False)]
print("Total rows for Heritage:", len(heritage))
if len(heritage) > 0:
    row = heritage.iloc[0]
    for col in df.columns:
        if pd.notna(row[col]):
            print(f"{col}: {row[col]}")
            if "연납" in str(row[col]):
                print("  --> FOUND '연납' here!")
