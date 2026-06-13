import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_csv("insurance_data/5_savings/variable_term/extracted_data.csv")
rows = df[df['보험회사'].str.contains('흥국', na=False)]
for idx, row in rows.iterrows():
    pname = row['상품명']
    amt = row['가입금액']
    prem = row['기준보험료']
    print(f"Index: {idx} | Prod: {pname} | Amt: {repr(amt)} | Prem: {prem}")
