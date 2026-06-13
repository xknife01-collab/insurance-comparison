import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
df = pd.read_csv(csv_path, encoding='utf-8-sig')

for co in ['DB손보', '롯데손보']:
    sub = df[df['보험회사'] == co]
    print(f"\n=== {co} ({len(sub)} rows) ===")
    for idx, row in sub.head(5).iterrows():
        print(f"Product: {row['상품명']}, Rider: {row['담보명(급부명)']}, Male: {row['남성보험료']}, Female: {row['여성보험료']}")
