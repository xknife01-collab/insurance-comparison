import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
try:
    df = pd.read_csv(csv_path)
    term_df = df[df['sub_type'].isin(['term_pure', 'term_ceo', 'variable_term'])]
    print(f"Total term-like rows: {len(term_df)}")
    print("Unique values of '구분' for term-like products:")
    for val, count in term_df['구분'].value_counts().items():
        print(f"  {repr(val)}: {count}")
except Exception as e:
    print("Error:", e)
