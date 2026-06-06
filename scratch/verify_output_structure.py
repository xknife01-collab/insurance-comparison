import os
import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

CAREGIVING_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
PROPERTY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.csv"

def main():
    if not os.path.exists(PROPERTY_CSV):
        print(f"Error: {PROPERTY_CSV} does not exist!")
        return
        
    df_care = pd.read_csv(CAREGIVING_CSV)
    df_prop = pd.read_csv(PROPERTY_CSV)
    
    print("=== Column Length Comparison ===")
    print(f"Caregiving columns: {len(df_care.columns)}")
    print(f"Property columns: {len(df_prop.columns)}")
    
    print("\n=== Column Names Comparison ===")
    if list(df_care.columns) == list(df_prop.columns):
        print("SUCCESS: Columns are identical!")
    else:
        print("WARNING: Columns are not identical!")
        care_cols = set(df_care.columns)
        prop_cols = set(df_prop.columns)
        print(f"Caregiving only: {care_cols - prop_cols}")
        print(f"Property only: {prop_cols - care_cols}")
        
    print("\n=== Data Snippet (First 5 rows of Property) ===")
    print(df_prop.head()[["보험회사", "상품명", "구분", "담보명(급부명)", "기준보험료", "가입보험료", "source_file"]])
    
    print("\n=== Total Rows Extracted ===")
    print(f"Total Rows: {len(df_prop)}")
    
    # check for empty strings or nulls in main fields
    for col in ["보험회사", "상품명", "구분", "담보명(급부명)"]:
        null_count = df_prop[col].isna().sum()
        print(f"Null count in '{col}': {null_count}")

if __name__ == "__main__":
    main()
