import csv
import os
import re

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

def get_premium_val(val):
    if not val: return 0
    clean = re.sub(r'[^\d]', '', str(val))
    try: return int(clean) if clean else 0
    except: return 0

try:
    # 1. Read all rows from the clean file (v10 output)
    all_raw_data = []
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        all_raw_data = list(reader)
        fieldnames = reader.fieldnames

    # 2. Group by product and separate main/riders
    # Note: We need the ORIGINAL rows from the raw files if possible, 
    # but since we already merged them in v10, we'll try to split them back 
    # or just use the logic from the REBUILD phase.
    
    # Actually, it's better to re-run the rebuild but with "Main + 1 Rider" logic.
    pass

except Exception as e:
    print(f"Error: {e}")
