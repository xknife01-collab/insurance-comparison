import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident\extracted_data.csv"
df = pd.read_csv(csv_path)

aig_df = df[df['상품명'].str.contains('꼭 필요한 상해보험2601', na=False)]
print(aig_df.iloc[:, [0, 1, 2, 3, 7, 8, 15, 16]].to_string())
