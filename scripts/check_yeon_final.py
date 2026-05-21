import pandas as pd
import os

def check_for_yeon():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    print("[*] Searching for '연' in all cells...")
    found = False
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.values])
        if '연' in row_str:
            print(f"Row {idx} contains '연': {row_str}")
            found = True
    
    if not found:
        print("[!] No '연' found in cell values. Checking columns...")
        for col in df.columns:
            if '연' in str(col):
                print(f"Column '{col}' contains '연'")
                found = True

    if not found:
        print("[!] Still no '연' found. Printing raw first row for debug:")
        print(df.iloc[0].values)

if __name__ == "__main__":
    check_for_yeon()
