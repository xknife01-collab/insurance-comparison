import pandas as pd
import os

file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls'

try:
    df_list = pd.read_html(file_path)
    df = df_list[0]
    print(f"File: {os.path.basename(file_path)}")
    print(f"Total Columns: {len(df.columns)}")
    print("\n--- Header Rows (first 5) ---")
    for i in range(min(5, len(df))):
        print(f"Row {i}: {df.iloc[i].tolist()[:15]}") # Print first 15 cols of each row
    
    # Try to find which columns contain keywords
    print("\n--- Column Content Sample ---")
    for col in df.columns:
        # Sample some non-null values from this column
        samples = df[col].dropna().unique()[:3]
        print(f"Col {col} samples: {samples}")
        
except Exception as e:
    print(f"Error: {e}")
