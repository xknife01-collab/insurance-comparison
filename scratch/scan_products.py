import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

# Find DB생명, KB라이프, 한화생명, 동양생명, 하나생명
cos = ['DB생명', 'KB라이프', '동양생명', '한화생명', '하나생명', '흥국생명']
filtered_df = df[df['보험회사'].str.contains('|'.join(cos), na=False)]

print("=== RAW EXTRACTED PREMIUMS FOR SELECT LIFE INSURERS ===")
for idx, r in filtered_df.drop_duplicates(subset=['보험회사', '상품명', '남성보험료', '여성보험료']).iterrows():
    print(f"Company: {r['보험회사']}")
    print(f"Product: {r['상품명']}")
    print(f"Male Premium: {r['남성보험료']}")
    print(f"Female Premium: {r['여성보험료']}")
    print(f"Source file: {r['source_file']}")
    print("-" * 50)
