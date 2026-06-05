# -*- coding: utf-8 -*-
import os
import pandas as pd
import sys

# Ensure stdout handles Korean encoding properly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\health_general\extracted_data.csv"
TS_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\lib\insurance\healthGeneral\healthGeneralData.ts"

def verify():
    print("==================== Verifying Comprehensive Health Insurance Data ====================")
    
    # 1. Check CSV existence
    if not os.path.exists(CSV_PATH):
        print(f"[FAIL] CSV file does not exist: {CSV_PATH}")
        sys.exit(1)
    print(f"[PASS] CSV file exists at: {CSV_PATH}")
    
    # 2. Load CSV and verify shape
    try:
        df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    except Exception as e:
        print(f"[FAIL] Failed to load CSV: {e}")
        sys.exit(1)
        
    print(f"[INFO] Loaded CSV successfully. Rows: {len(df)}, Columns: {len(df.columns)}")
    
    # 3. Verify column count (must be exactly 46)
    if len(df.columns) != 46:
        print(f"[FAIL] Column count is {len(df.columns)} instead of 46!")
        sys.exit(1)
    print("[PASS] Column count is exactly 46.")
    
    # 4. Verify Column Headers
    expected_headers = [
        "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
        "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율", 
        "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
    ] + [f"원본_열_{i}" for i in range(30)]
    
    headers_match = True
    for idx, (h_act, h_exp) in enumerate(zip(df.columns, expected_headers)):
        if h_act != h_exp:
            print(f"[FAIL] Column index {idx} mismatch: expected '{h_exp}', got '{h_act}'")
            headers_match = False
            
    if headers_match:
        print("[PASS] All column headers match the standard caregiving/health general schema exactly!")
    else:
        sys.exit(1)
        
    # 5. Check for empty critical values
    empty_company = df["보험회사"].isna().sum()
    empty_product = df["상품명"].isna().sum()
    empty_coverage = df["담보명(급부명)"].isna().sum()
    
    print(f"[INFO] Empty values - Company: {empty_company}, Product: {empty_product}, Coverage: {empty_coverage}")
    
    if empty_company > 0 or empty_product > 0:
        print("[WARNING] Found rows with empty company or product names. Please verify forward-fill logic.")
    else:
        print("[PASS] All rows have company and product names populated.")
        
    # 6. Verify TS existence
    if not os.path.exists(TS_PATH):
        print(f"[FAIL] TS data file does not exist: {TS_PATH}")
        sys.exit(1)
    print(f"[PASS] TS data file exists at: {TS_PATH}")
    
    print("\n[INFO] Sample rows from CSV:")
    print(df[["보험회사", "상품명", "담보명(급부명)", "가입보험료", "갱신구분"]].head(5))
    
    print("\n[SUCCESS] All checks passed successfully!")

if __name__ == "__main__":
    verify()
