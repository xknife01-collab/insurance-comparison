import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"

with open(csv_path, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    headers = next(reader)
    
    company_idx = headers.index("보험회사")
    product_idx = headers.index("상품명")
    gubun_idx = headers.index("구분")
    m_prem_idx = headers.index("기준보험료")
    f_prem_idx = headers.index("가입보험료")
    sub_type_idx = headers.index("sub_type")
    
    print("Standard Term products raw premiums:")
    seen = set()
    for row in reader:
        pname = row[product_idx]
        company = row[company_idx]
        gubun = row[gubun_idx]
        sub_type = row[sub_type_idx]
        
        if sub_type in ['term_pure', 'variable_term'] and gubun == "주계약":
            key = (company, pname)
            if key not in seen:
                seen.add(key)
                print(f"{company} | {pname} | sub_type: {sub_type} | male: {row[m_prem_idx]} | female: {row[f_prem_idx]}")
