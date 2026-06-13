import pandas as pd
import sys

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(csv_path, encoding='utf-8-sig')

print(f"Total rows: {len(df)}")
print("Columns:", list(df.columns))
print("\nUnique Companies:")
print(df["보험회사"].unique())

print("\nSample Rows:")
print(df[["보험회사", "상품명", "구분", "담보명(급부명)", "남성보험료", "여성보험료", "source_file"]].head(10).to_string())
