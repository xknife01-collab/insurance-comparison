import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")
ansim_df = df[df['상품명'].str.contains('안심보험', na=False) & df['보험회사'].str.contains('DB', na=False)]

print("DB 안심보험 rows:")
for idx, row in ansim_df.iterrows():
    print(f"Company: {row['보험회사']}")
    print(f"Product: {row['상품명']}")
    print(f"Division: {row['구분']}")
    print(f"Coverage: {row['담보명(급부명)']}")
    print(f"Face Amt: {row['가입금액']}")
    print(f"Benefit Amt: {row['지급금액']}")
    print(f"Male Premium: {row['남성보험료']}")
    print(f"Female Premium: {row['여성보험료']}")
    print(f"Source file: {row['source_file']}")
    print("-" * 50)
