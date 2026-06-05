import csv

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
with open(csv_path, "r", encoding="cp949", errors="ignore") as f:
    reader = csv.reader(f)
    headers = next(reader)
    print("CSV Headers:", headers)
    try:
        company_idx = headers.index("보험회사")
    except ValueError:
        company_idx = 0
    try:
        product_idx = headers.index("상품명")
    except ValueError:
        product_idx = 1
    try:
        gubun_idx = headers.index("구분")
    except ValueError:
        gubun_idx = 2
    try:
        m_premium_idx = headers.index("기준보험료")
    except ValueError:
        m_premium_idx = 7
    try:
        f_premium_idx = headers.index("가입보험료")
    except ValueError:
        f_premium_idx = 8
    try:
        sub_type_idx = headers.index("sub_type")
    except ValueError:
        sub_type_idx = -1
    
    print("Headers:", headers)
    for i, row in enumerate(reader):
        comp = row[company_idx]
        prod = row[product_idx]
        if "처브" in comp or "Chubb" in prod or "미래에셋" in comp or "Mirae" in prod:
            if "정기" in prod or "term" in row[sub_type_idx]:
                print(f"Row {i+2}: {comp} | {prod} | {row[gubun_idx]} | male: {row[m_premium_idx]} | female: {row[f_premium_idx]} | subtype: {row[sub_type_idx]}")
