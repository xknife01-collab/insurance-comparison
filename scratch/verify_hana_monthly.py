import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure\extracted_data.csv"
df = pd.read_csv(csv_path)

hana_rows = df[df["보험회사"] == "하나생명"]
print(hana_rows[["보험회사", "상품명", "기준보험료", "가입보험료"]])
