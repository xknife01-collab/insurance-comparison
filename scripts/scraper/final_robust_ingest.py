
import pandas as pd
import glob
import os
import re
import json

def clean_num(val):
    if pd.isna(val) or val == '-': return 0
    s = str(val).replace(",", "").strip()
    match = re.search(r'\d+', s)
    return int(match.group(0)) if match else 0

def robust_parse(filepath):
    try:
        # Load the whole file
        df = pd.read_excel(filepath, engine='xlrd', header=None)
        results = []
        filename = os.path.basename(filepath)
        
        cur_comp = "알수없음"
        cur_prod = "알수없음"
        
        for i in range(len(df)):
            row = df.iloc[i]
            if len(row) < 8: continue
            
            comp = str(row[1]).strip() if not pd.isna(row[1]) else ""
            prod = str(row[2]).strip() if not pd.isna(row[2]) else ""
            
            if comp and comp != "nan" and len(comp) > 1: cur_comp = comp
            if prod and prod != "nan" and len(prod) > 2: cur_prod = prod
            
            m_val = clean_num(row[6])
            f_val = clean_num(row[7])
            
            # If we found premiums, this is a valid rate row
            if m_val > 100 or f_val > 100:
                # Heuristic Age assigner if not found
                # If we have multiple 'classes' (1종, 2종), we'll keep them as unique products
                results.append({
                    "company": cur_comp,
                    "product": cur_prod,
                    "m": m_val,
                    "f": f_val,
                    "file": filename,
                    "row": i
                })
        return results
    except: return []

def main():
    files = glob.glob("scripts/scraper/raw_data/*.xls")
    all_extracted = []
    
    for f in files:
        print(f"[*] Processing: {os.path.basename(f)}")
        items = robust_parse(f)
        if items:
            all_extracted.extend(items)
            print(f"  [+] Extracted {len(items)} rows")

    with open("scripts/scraper/extracted_dump.json", "w", encoding="utf-8") as f:
        json.dump(all_extracted, f, ensure_ascii=False, indent=2)
    print(f"\n[*] TOTAL ROWS EXTRACTED: {len(all_extracted)}")

if __name__ == "__main__":
    main()
