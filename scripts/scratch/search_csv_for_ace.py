import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\home_fire\extracted_data.csv"
df = pd.read_csv(csv_path)

ace_rows = df[df['상품명'].str.contains('우리집 무사고', na=False)]
print(f"Total rows found for Ace: {len(ace_rows)}")
for idx, row in ace_rows.iterrows():
    print(f"회사: {row.get('보험회사')}, 구분: {row.get('구분')}, 담보명: {row.get('담보명(급부명)')}, 기준보험료: {row.get('기준보험료')}, 가입보험료: {row.get('가입보험료')}, 적용이율: {row.get('적용이율')}")
