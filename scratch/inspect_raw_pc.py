import pandas as pd
import os

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\file_43.xls"
df = pd.read_excel(filepath, engine='xlrd', header=None)

# Let's print rows 0 to 30
for idx in range(min(40, len(df))):
    print(f"Row {idx}: {df.iloc[idx].tolist()[:10]}")
