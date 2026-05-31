import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv'

def run():
    if not os.path.exists(csv_path):
        print("File does not exist")
        return
        
    try:
        df = pd.read_csv(csv_path, encoding='utf-8-sig')
    except:
        df = pd.read_csv(csv_path, encoding='cp949')
        
    print(f"Shape: {df.shape}")
    source_files = df['source_file'].dropna().unique()
    print(f"Unique source files in existing CSV ({len(source_files)} files):")
    for f in sorted(source_files):
        print(f"  - {f}")

if __name__ == "__main__":
    run()
