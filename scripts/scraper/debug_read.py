
import pandas as pd
import os
import io

f = 'scripts/scraper/raw_data/file_32.xls'
print(f"--- DEBUGGING {f} ---")

# Test 1: xlrd
try:
    df = pd.read_excel(f, engine='xlrd')
    print("[OK] xlrd success. Rows:", len(df))
except Exception as e:
    print("[FAIL] xlrd:", e)

# Test 2: HTML
try:
    raw = open(f, 'rb').read().decode('utf-8', errors='ignore')
    df = pd.read_html(io.StringIO(raw))[0]
    print("[OK] read_html success. Rows:", len(df))
except Exception as e:
    print("[FAIL] read_html:", e)

# Test 3: Binary Peek
try:
    with open(f, 'rb') as x:
        print("[PEEK] First 50 bytes:", x.read(50))
except Exception as e:
    print("[FAIL] Peek:", e)
