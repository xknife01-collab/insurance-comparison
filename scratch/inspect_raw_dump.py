import pandas as pd

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\raw_insurance_dump.csv"

for enc in ['utf-8-sig', 'cp949', 'utf-8', 'euc-kr']:
    try:
        df = pd.read_csv(filepath, nrows=5, encoding=enc)
        print(f"--- Encoding: {enc} ---")
        print("Columns:")
        print(df.columns.tolist())
        print("\nFirst 3 rows:")
        print(df.head(3))
        break
    except Exception as e:
        print(f"Error reading CSV with {enc}: {e}")
