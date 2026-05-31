import pandas as pd
import os

care_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
whole_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\whole_life\extracted_data.csv"

def verify():
    if not os.path.exists(care_path):
        print(f"[ERR] Caregiving file not found at {care_path}")
        return
    if not os.path.exists(whole_path):
        print(f"[ERR] Whole life file not found at {whole_path}")
        return
        
    df_care = pd.read_csv(care_path, nrows=5)
    df_whole = pd.read_csv(whole_path, nrows=5)
    
    cols_care = list(df_care.columns)
    cols_whole = list(df_whole.columns)
    
    print(f"Caregiving Columns Count: {len(cols_care)}")
    print(f"Whole Life Columns Count: {len(cols_whole)}")
    
    mismatch = []
    for idx, (c, w) in enumerate(zip(cols_care, cols_whole)):
        if c != w:
            mismatch.append((idx, c, w))
            
    if mismatch:
        print("[ERR] Mismatched columns found:")
        for idx, c, w in mismatch:
            print(f"  - Col {idx}: Caregiving='{c}' vs Whole Life='{w}'")
    else:
        print("[OK] All column headers match perfectly!")
        
    # Check if there are columns missing in length
    if len(cols_care) != len(cols_whole):
        print(f"[ERR] Columns length mismatch: {len(cols_care)} vs {len(cols_whole)}")
    else:
        print("[OK] Columns length matches perfectly (46 columns).")

if __name__ == "__main__":
    verify()
