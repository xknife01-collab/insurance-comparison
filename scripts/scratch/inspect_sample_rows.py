import pandas as pd
import os

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

def run():
    if not os.path.exists(csv_path):
        print("CSV does not exist")
        return
        
    df = pd.read_csv(csv_path)
    print(f"Total rows: {len(df)}")
    
    # Select 3 sample rows from different companies
    sample_rows = []
    companies = df['보험회사'].unique()
    for co in companies[:3]:
        co_rows = df[df['보험회사'] == co]
        if len(co_rows) > 0:
            sample_rows.append(co_rows.iloc[0])
            
    for idx, row in enumerate(sample_rows):
        print(f"\n=================== SAMPLE ROW {idx+1} ===================")
        for col in df.columns:
            val = row[col]
            if pd.notna(val) and val != "":
                print(f"  {col}: {val}")

if __name__ == "__main__":
    run()
