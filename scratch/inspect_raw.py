import pandas as pd
import os

file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_0.xls'

try:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read().strip()
    
    df_list = pd.read_html(content)
    if df_list:
        df = df_list[0]
        print(f"--- Raw Content of {os.path.basename(file_path)} (First 15 rows) ---")
        # Flatten headers for easier viewing
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = [f"C{i}" for i in range(len(df.columns))]
        
        for i in range(min(15, len(df))):
            print(f"Row {i}: {df.iloc[i].tolist()[:10]}")
except Exception as e:
    print(f"Error: {e}")
