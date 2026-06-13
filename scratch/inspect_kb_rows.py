import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
df = pd.read_csv(csv_path)

kb_rows = df[df["상품명"].str.contains("KB 골든라이프 딱좋은", na=False)]
print(f"Total KB rows: {len(kb_rows)}")
print(kb_rows[["보험회사", "상품명", "구분", "담보명(급부명)", "남성보험료", "여성보험료"]].to_string())
