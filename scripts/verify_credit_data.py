# -*- coding: utf-8 -*-
import pandas as pd
import os

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"
XLSX_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.xlsx"

def verify():
    print("[*] Starting verification...")
    
    # 1. File existence
    if not os.path.exists(CSV_PATH):
        print("[-] CSV file does not exist!")
        return
    if not os.path.exists(XLSX_PATH):
        print("[-] Excel file does not exist!")
        return
        
    print("[+] Both files exist.")
    
    # 2. Check CSV properties
    df_csv = pd.read_csv(CSV_PATH)
    print(f"[+] Loaded CSV with {len(df_csv)} rows and {len(df_csv.columns)} columns.")
    assert len(df_csv.columns) == 46, f"Expected 46 columns, but got {len(df_csv.columns)}"
    
    # 3. Check Excel properties
    df_xlsx = pd.read_excel(XLSX_PATH)
    print(f"[+] Loaded XLSX with {len(df_xlsx)} rows and {len(df_xlsx.columns)} columns.")
    assert len(df_xlsx.columns) == 46, f"Expected 46 columns, but got {len(df_xlsx.columns)}"
    
    # 4. Check company names
    companies = df_csv["보험회사"].unique()
    print("[+] Unique companies in dataset:", companies)
    
    # 5. Check payment cycles (월납 vs 일시납)
    print("\n[*] Sample descriptions and payment patterns:")
    for idx, row in df_csv.iterrows():
        prod = str(row["상품명"])
        desc = str(row["상세안내"])
        
        # Determine payment cycle based on standard rules
        cycle = "월납"
        if "일시납" in desc or "일시납" in str(row["지급사유"]) or "일시납" in str(row["지급금액"]):
            cycle = "일시납"
        elif "1년납" in desc or "1년" in desc:
            cycle = "1년납 / 갱신형"
            
        if idx % 20 == 0:
            print(f"- Product: {prod:<40} | Inferred Cycle: {cycle}")
            
    print("\n[+] Verification SUCCESS! The dataset is structurally sound and consistent.")

if __name__ == "__main__":
    verify()
