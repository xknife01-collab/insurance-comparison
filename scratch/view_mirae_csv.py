import csv

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
with open(csv_path, "r", encoding="utf-8-sig", errors="ignore") as f:
    reader = csv.reader(f)
    headers = next(reader)
    company_idx = headers.index("보험회사")
    product_idx = headers.index("상품명")
    gubun_idx = headers.index("구분")
    m_premium_idx = headers.index("기준보험료")
    f_premium_idx = headers.index("가입보험료")
    sub_type_idx = headers.index("sub_type")
    
    for i, row in enumerate(reader):
        comp = row[company_idx]
        prod = row[product_idx]
        if "미래에셋" in comp:
            if "정기" in prod or "term" in row[sub_type_idx]:
                print(f"Row {i+2}: {comp} | {prod} | {row[gubun_idx]} | male: {row[m_premium_idx]} | female: {row[f_premium_idx]} | subtype: {row[sub_type_idx]}")
