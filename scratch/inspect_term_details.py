import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"

targets = [
    "라이프UP",
    "e정기보험",
    "헤리티지 정기보험"
]

with open(csv_path, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    headers = next(reader)
    
    company_idx = headers.index("보험회사")
    product_idx = headers.index("상품명")
    gubun_idx = headers.index("구분")
    m_prem_idx = headers.index("기준보험료")
    f_prem_idx = headers.index("가입보험료")
    amount_idx = headers.index("가입금액")
    
    print("Columns: 보험회사, 상품명, 구분, 가입금액, 기준보험료(남성?), 가입보험료(여성?)")
    for row in reader:
        pname = row[product_idx]
        company = row[company_idx]
        gubun = row[gubun_idx]
        if any(t in pname for t in targets) and gubun == "주계약":
            print(f"{company} | {pname} | {gubun} | 가입금액: {row[amount_idx]} | 기준보험료: {row[m_prem_idx]} | 가입보험료: {row[f_prem_idx]}")
