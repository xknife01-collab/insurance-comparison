import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_47.xls"

# Let's see what happens with read_excel
try:
    df = pd.read_excel(filepath, engine='xlrd')
    print("xlrd success. Shape:", df.shape)
except Exception as e:
    print("xlrd failed:", e)

# Let's inspect raw bytes
with open(filepath, 'rb') as f:
    raw_bytes = f.read(500)
    print("Raw bytes start:", raw_bytes[:200])

# Let's try decoding
for enc in ['utf-8', 'utf-16', 'cp949', 'euc-kr', 'utf-16-le', 'utf-16-be']:
    try:
        text = raw_bytes.decode(enc)
        print(f"Decode {enc} success. Start text: {text[:50]}")
    except Exception as e:
        print(f"Decode {enc} failed:", e)
