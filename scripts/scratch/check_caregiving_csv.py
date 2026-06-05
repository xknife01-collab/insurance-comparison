import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"

try:
    df = pd.read_csv(CSV_PATH, nrows=5)
    print("Caregiving CSV Columns:")
    print(list(df.columns))
    print("Number of columns:", len(df.columns))
    print("First row values:")
    print(df.iloc[0].to_dict())
except Exception as e:
    print("Error:", e)
