import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

print("=== SEARCH FOR '일시납' OR '일시불' ===")
# Search in product names and detailed guides
match_ilsi = df[
    df['상품명'].str.contains('일시납|일시불', na=False) |
    df['상세안내'].str.contains('일시납|일시불', na=False) |
    df['담보명(급부명)'].str.contains('일시납|일시불', na=False)
]

print(f"Number of rows matching '일시납' or '일시불': {len(match_ilsi)}")
if len(match_ilsi) > 0:
    print(match_ilsi[['보험회사', '상품명', '담보명(급부명)', 'source_file']].drop_duplicates().to_string())
else:
    print("No matches found for '일시납' or '일시불' in dementia data.")
