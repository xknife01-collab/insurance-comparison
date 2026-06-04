# -*- coding: utf-8 -*-
import os
import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.csv"
XLSX_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal\extracted_data.xlsx"
CAREGIVING_CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"

def verify():
    # Check if files exist
    assert os.path.exists(CSV_PATH), "CSV file does not exist!"
    assert os.path.exists(XLSX_PATH), "Excel file does not exist!"
    print("[+] Both CSV and Excel files exist.")
    
    # Load dataframes
    df_legal = pd.read_csv(CSV_PATH)
    df_care = pd.read_csv(CAREGIVING_CSV_PATH)
    
    # Compare dimensions
    print(f"[*] Legal data shape: {df_legal.shape}")
    print(f"[*] Caregiving data shape: {df_care.shape}")
    
    assert df_legal.shape[1] == 46, f"Expected 46 columns, but got {df_legal.shape[1]}"
    assert df_care.shape[1] == 46, f"Expected 46 columns, but got {df_care.shape[1]}"
    print("[+] Both files have exactly 46 columns.")
    
    # Compare columns
    legal_cols = list(df_legal.columns)
    care_cols = list(df_care.columns)
    
    for i, (lc, cc) in enumerate(zip(legal_cols, care_cols)):
        assert lc == cc, f"Column mismatch at index {i}: Legal has '{lc}', Caregiving has '{cc}'"
        
    print("[+] All column headers match caregiving dataset exactly!")
    
    # Check row counts
    print(f"[+] Total rows in extracted legal data: {len(df_legal)}")
    
    # Sample check
    print("\n--- Sample Rows (First 3) ---")
    for idx, row in df_legal.head(3).iterrows():
        print(f"\nRow {idx}:")
        print(f"  Company: {row['보험회사']}")
        print(f"  Product: {row['상품명']}")
        print(f"  Coverage: {row['담보명(급부명)']}")
        print(f"  Male Premium: {row['기준보험료']}")
        print(f"  Female Premium: {row['가입보험료']}")
        print(f"  Source: {row['source_file']}")
        
    print("\n[+] Verification successful!")

if __name__ == "__main__":
    verify()
