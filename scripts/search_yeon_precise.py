import pandas as pd
import os

def find_yeon_exactly():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    print("[*] Searching for '연' in ALL cells...")
    found_data = []
    for idx, row in df.iterrows():
        for col_name in df.columns:
            val = str(row[col_name])
            if '연' in val:
                found_data.append((idx, col_name, val))
                print(f"Row {idx}, Col '{col_name}': {val}")
    
    # Also check if Column Headers have '연'
    for col_name in df.columns:
        if '연' in str(col_name):
            print(f"Column Header '{col_name}' contains '연'")
            
    print(f"[*] Search finished. Found {len(found_data)} cells with '연'.")
    return found_data

if __name__ == "__main__":
    find_yeon_exactly()
