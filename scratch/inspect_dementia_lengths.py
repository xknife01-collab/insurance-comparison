import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
df = pd.read_csv(csv_path, encoding='utf-8-sig')

cols = {
    "보험회사": "company_name",
    "상품명": "product_name",
    "구분": "division",
    "담보명(급부명)": "benefit_name",
    "지급사유": "benefit_reason",
    "지급금액": "benefit_amount",
    "가입금액": "insured_amount",
    "source_file": "source_file"
}

for kor, eng in cols.items():
    max_len = df[kor].fillna("").astype(str).str.len().max()
    print(f"{eng} (from {kor}): max length = {max_len}")
