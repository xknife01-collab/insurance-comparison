import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(csv_path)

print(f"Total rows: {len(df)}")
print("Columns:", list(df.columns))
print("\nUnique Companies:")
print(df["보험회사"].unique())

print("\nSample Rows:")
print(df[["보험회사", "상품명", "구분", "담보명(급부명)", "남성보험료", "여성보험료", "source_file"]].head(15))
