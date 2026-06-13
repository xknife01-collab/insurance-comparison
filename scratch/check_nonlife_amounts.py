import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

nonlife_df = df[df['보험회사'].str.contains('손보|화재|해상', na=False)]

print("=== NON-LIFE AMOUNTS ===")
unique_nonlife = nonlife_df[['보험회사', '상품명', '담보명(급부명)', '가입금액', '지급금액']].drop_duplicates(subset=['보험회사', '상품명', '담보명(급부명)']).head(30)
for idx, r in unique_nonlife.iterrows():
    print(f"Company: {r['보험회사']}")
    print(f"Product: {r['상품명']}")
    print(f"Coverage: {r['담보명(급부명)']}")
    print(f"Face Amt (가입금액): {r['가입금액']}")
    print(f"Benefit Amt (지급금액): {r['지급금액']}")
    print("-" * 50)
