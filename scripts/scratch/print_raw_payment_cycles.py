import pandas as pd
df = pd.read_csv("insurance_data/5_savings/variable_term/extracted_data.csv")
companies = ["흥국", "푸본", "교보", "하나", "라이프플래닛"]
for c in companies:
    sub = df[df['보험회사'].str.contains(c, na=False)]
    if not sub.empty:
        print(f"=== Company: {c} (Total {len(sub)} rows) ===")
        # Print unique values of '구분' and first few rows
        print("Unique GUBUN:", sub['구분'].unique())
        for idx, row in sub.head(3).iterrows():
            print(f"  Prod: {row['상품명']} | GUBUN: {row['구분']} | AMT: {row['가입금액']} | M: {row['기준보험료']} | F: {row['가입보험료']}")
            # Print the entire row as list
            print(f"    Raw: {list(row)[:12]}")
