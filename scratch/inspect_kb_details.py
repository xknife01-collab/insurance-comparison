import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')
kb = df[df['상품명'].str.contains('KB', na=False)]
print("Total rows for KB:", len(kb))

# Print first 20 rows of KB
for i, r in kb.head(25).iterrows():
    print(f"Row {i} | 가입금액: {r['가입금액']} | 기준보험료: {r['기준보험료']} | 가입보험료: {r['가입보험료']} | 구분: {r['구분']} | 담보명: {r['담보명(급부명)']}")
