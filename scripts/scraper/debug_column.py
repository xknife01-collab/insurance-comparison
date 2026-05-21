
import pandas as pd
import os
import io

f = 'scripts/scraper/raw_data/file_32.xls'
print(f"--- ANALYZING STRUCTURE OF {f} ---")

df = pd.read_excel(f, engine='xlrd')
print("Columns:", df.columns.tolist())
print("-" * 30)
print(df.head(10).to_csv())
