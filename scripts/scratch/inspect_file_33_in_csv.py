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
        
    df_33 = df[df['source_file'] == 'file_33.xls']
    print(f"Number of rows from file_33.xls: {len(df_33)}")
    if len(df_33) > 0:
        print("First 5 rows from file_33.xls:")
        for idx, row in df_33.head(5).iterrows():
            print(f"Row {idx}: {row.tolist()[:10]}")

if __name__ == "__main__":
    run()
