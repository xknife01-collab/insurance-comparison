import os
import pandas as pd
import glob
import sys

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

# Search for source files in parent and sub directories
search_pattern = "../보장성_상품비교_*.xls"
files = glob.glob(search_pattern) + glob.glob("../*.xls") + glob.glob("*.xls")

print("Found XLS files to check:")
for f in files[:8]:
    print(f"  {f}")

# Let's read the one that Samsung Fire is likely contained in.
# We will inspect the column names of any XLS file to see if there is '월' or '연' or '년' related column headers.
for f in files:
    try:
        # Read only top 5 rows to see sheet headers
        df_temp = pd.read_excel(f, nrows=10)
        # Check if Samsung is in the first column
        company_col = df_temp.columns[0]
        print(f"\nFile: {f}")
        print("Columns:", df_temp.columns.tolist())
        # Print first row
        if len(df_temp) > 0:
            print("Row 1 sample:", df_temp.iloc[0].tolist())
        break
    except Exception as e:
        print(f"Error reading {f}: {e}")
