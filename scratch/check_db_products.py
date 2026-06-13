import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

db_rows = df[df['보험회사'].str.contains('DB', na=False)]
print("DB Companies in extracted_data.csv:")
print(db_rows['보험회사'].unique())
print("DB Products:")
print(db_rows['상품명'].unique())
