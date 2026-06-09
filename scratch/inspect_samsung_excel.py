import pandas as pd
import openpyxl

file_path = "insurance_data/1_guaranteed/brain/뇌보험_담보_통합_최종_성별분리.xlsx"

print("--- Reading Sheets ---")
wb = openpyxl.load_workbook(file_path, read_only=True)
print("Sheet names:", wb.sheetnames)

df = pd.read_excel(file_path)
print("\n--- Columns in Excel ---")
print(df.columns.tolist())

# Filter for Samsung Fire
samsung_df = df[df.iloc[:, 0].astype(str).str.contains("삼성화재", na=False)]

print(f"\n--- Total Samsung Fire Rows: {len(samsung_df)} ---")
if len(samsung_df) > 0:
    print("\n--- First 5 Samsung Fire Rows Details ---")
    for idx, row in samsung_df.head(5).iterrows():
        print(f"Row {idx}:")
        for col_name, val in row.items():
            print(f"  {col_name}: {val}")
        print("-" * 50)
else:
    print("No Samsung Fire rows found.")
