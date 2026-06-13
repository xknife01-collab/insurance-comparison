import pandas as pd
df = pd.read_csv("insurance_data/5_savings/variable_term/extracted_data.csv")
hk_rows = df[df['보험회사'] == '흥국생명']
for idx, row in hk_rows.iterrows():
    print(f"Product: {row['상품명']} | GUBUN: {row['구분']} | AMT: {row['가입금액']} | M: {row['기준보험료']} | F: {row['가입보험료']}")
