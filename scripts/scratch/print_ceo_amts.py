import pandas as pd
df = pd.read_csv("insurance_data/5_savings/variable_term/extracted_data.csv")
ceo_rows = df[df['sub_type'] == 'term_ceo']
for idx, row in ceo_rows.head(5).iterrows():
    print(f"Company: {row['보험회사']} | Prod: {row['상품명']} | AMT: {row['가입금액']} | M: {row['기준보험료']}")
