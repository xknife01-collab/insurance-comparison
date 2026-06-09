import pandas as pd
import sys
from bs4 import BeautifulSoup

if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

# Let's read the raw HTML content of the XLS file as these are often HTML tables renamed to .xls
file_path = "../장기보장성 비교 공시 (7).xls"

print(f"Reading {file_path} as HTML/XML...")
with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "lxml")
table = soup.find("table")

if table:
    print("Found table!")
    # Get all row texts
    rows = table.find_all("tr")
    print(f"Total rows found: {len(rows)}")
    
    # Print first 5 rows to see headers
    for idx, r in enumerate(rows[:6]):
        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
        print(f"Row {idx+1}: {cols}")
        
    print("\n--- Let's find a Samsung Fire Row ---")
    samsung_count = 0
    for idx, r in enumerate(rows):
        cols = [c.get_text(strip=True) for c in r.find_all(["td", "th"])]
        if any("삼성화재" in str(col) for col in cols):
            print(f"Samsung Fire Row {idx+1}: {cols}")
            samsung_count += 1
            if samsung_count >= 5:
                break
else:
    print("No table found in XLS file. Let's try reading as normal excel using xlrd.")
    try:
        df = pd.read_excel(file_path, engine='xlrd')
        print(df.head(5))
    except Exception as e:
        print("xlrd error:", e)
