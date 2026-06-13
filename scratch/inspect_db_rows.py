import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(csv_path)

db_rows = df[df["상품명"].str.contains("참좋은더보장", na=False)]
print(f"Total DB rows: {len(db_rows)}")
print(db_rows[["보험회사", "상품명", "구분", "담보명(급부명)", "남성보험료", "여성보험료"]].head(15).to_string())
