import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

csv_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"

with open(csv_path, "r", encoding="utf-8-sig") as f:
    reader = csv.reader(f)
    headers = next(reader)
    
    company_idx = headers.index("보험회사") if "보험회사" in headers else 0
    product_idx = headers.index("상품명") if "상품명" in headers else 1
    gubun_idx = headers.index("구분") if "구분" in headers else 2
    m_prem_idx = headers.index("기준보험료") if "기준보험료" in headers else -1
    f_prem_idx = headers.index("가입보험료") if "가입보험료" in headers else -1
    applied_rate_idx = headers.index("적용이율") if "적용이율" in headers else -1
    amount_idx = headers.index("가입금액") if "가입금액" in headers else -1
    sub_type_idx = headers.index("sub_type") if "sub_type" in headers else -1

    print("Headers:", headers)
    
    print("\n--- Rows for 라이프UP 정기보험 ---")
    f.seek(0)
    next(reader)
    for row in reader:
        if "라이프UP" in row[product_idx]:
            print({headers[i]: row[i] for i in range(len(headers))})

    print("\n--- Rows for e정기보험 ---")
    f.seek(0)
    next(reader)
    for row in reader:
        if "e정기보험" in row[product_idx]:
            print({headers[i]: row[i] for i in range(len(headers))})
            
    print("\n--- Rows for 헤리티지 정기보험 ---")
    f.seek(0)
    next(reader)
    for row in reader:
        if "헤리티지 정기보험" in row[product_idx] and "변액" not in row[product_idx]:
            print({headers[i]: row[i] for i in range(len(headers))})
