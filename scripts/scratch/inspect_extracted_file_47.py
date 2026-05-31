import pandas as pd
import os
import io

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

def run():
    df = pd.read_csv(csv_path)
    # filter for rows where source_file is file_47.xls or equivalent
    file_47_rows = df[df['source_file'].str.contains('file_47|7.xls', case=False, na=False)]
    print(f"Number of rows: {len(file_47_rows)}")
    for idx, row in file_47_rows.iterrows():
        print(f"Product: {row['상품명']}")
        print(f"Rider: {row['담보명(급부명)']}")
        print(f"Source: {row['source_file']}")
        print("-" * 40)

if __name__ == "__main__":
    run()
