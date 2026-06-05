import pandas as pd

df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv', encoding='utf-8')
fubon = df[df['상품명'].str.contains('원패스', na=False)]
print("Total rows for Fubon Onepass:", len(fubon))
for idx, r in fubon.head(15).iterrows():
    print(f"Row {idx} | 가입금액: {r['가입금액']} | 기준보험료: {r['기준보험료']} | 구분: {r['구분']} | 담보명: {r['담보명(급부명)']}")
