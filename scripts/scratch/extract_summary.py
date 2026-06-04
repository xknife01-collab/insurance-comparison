# -*- coding: utf-8 -*-
import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"
REPORT_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\summary_report.md"

def extract_summary():
    df = pd.read_csv(CSV_PATH)
    
    main_contracts = df[df["구분"] == "주계약"].copy()
    unique_products = main_contracts[["보험회사", "상품명", "담보명(급부명)", "기준보험료", "가입보험료", "상세안내"]].drop_duplicates(subset=["상품명", "담보명(급부명)"])
    
    lines = []
    lines.append("# 신용대출/신용보장보험 상품명 및 보험료 추출 요약\n")
    lines.append("| 보험회사 | 상품명 | 담보명(급부명) | 남성 기준보험료 (40세) | 여성 가입보험료 (40세) | 납입형태 |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    
    for idx, row in unique_products.iterrows():
        desc = str(row["상세안내"])
        cycle = "월납"
        if "일시납" in desc:
            cycle = "일시납"
            
        co = row["보험회사"]
        prod = row["상품명"]
        cov = row["담보명(급부명)"]
        m_prem = row["기준보험료"] if pd.notna(row["기준보험료"]) else "-"
        f_prem = row["가입보험료"] if pd.notna(row["가입보험료"]) else "-"
        
        lines.append(f"| {co} | {prod} | {cov} | {m_prem} | {f_prem} | {cycle} |")
        
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print("Report written successfully.")

if __name__ == "__main__":
    extract_summary()
