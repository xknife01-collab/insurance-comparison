import pandas as pd
df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")
shinhan = df[df['보험회사'].str.contains('신한', na=False)]
for idx, r in shinhan.iterrows():
    print(f"Company: {r['보험회사']} | Prod: {r['상품명']} | Div: {r['구분']} | Cov: {r['담보명(급부명)']} | Amt: {r['가입금액']} | Male: {r['남성보험료']} | Female: {r['여성보험료']}")
