import pandas as pd
import glob
import os

files = glob.glob("scripts/scraper/raw_data/*.xls")

for f in files:
    print(f"\n[>>>] Analyzing: {os.path.basename(f)}")
    try:
        # Try reading without header first to see what's in there
        df = pd.read_excel(f, engine='xlrd', header=None)
        print(f"  - Shape: {df.shape}")
        print("  - First 10 rows (raw):")
        # Ensure encoding-safe printing for the console if possible
        for i, row in df.head(10).iterrows():
            print(f"    Row {i}: {row.tolist()}")
    except Exception as e:
        print(f"  - Error reading: {e}")
