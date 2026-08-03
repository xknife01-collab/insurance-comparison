import pandas as pd
import os

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
file_40 = os.path.join(root_dir, "file_40.xls")

try:
    dfs = pd.read_html(file_40)
    print("HTML Format")
    print(dfs[0].head(10))
except:
    try:
        df = pd.read_excel(file_40)
        print("Excel Format")
        print(df.head(10))
    except Exception as e:
        print(f"Error: {e}")
