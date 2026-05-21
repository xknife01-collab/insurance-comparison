
import pandas as pd
import glob
import os
import re

def scan():
    files = glob.glob("scripts/scraper/raw_data/*.xls")
    for f in files:
        try:
            # We use try/except specifically for read_html which is slow and can fail on binary XLS
            tables = pd.read_html(f)
            if not tables: continue
            df = tables[0]
            txt = df.to_string()
            # Look for "40세" etc anywhere in the table
            match = re.search(r'([0-9]{1,2})세', txt)
            age = match.group(1) if match else "?"
            print(f"{os.path.basename(f)}: Age {age} ({len(df)} rows)")
        except:
            pass

if __name__ == "__main__":
    scan()
