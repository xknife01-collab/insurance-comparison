import pandas as pd
import glob
import os

def find_samsung_meritz():
    raw_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"
    all_files = glob.glob(os.path.join(raw_dir, "*.xls"))
    
    found_files = []
    
    print("-" * 50)
    print("[*] SEARCHING FOR SAMSUNG & MERITZ IN 56 FILES...")
    for f_path in all_files:
        f_name = os.path.basename(f_path)
        if os.path.getsize(f_path) < 1000: continue
        
        try:
            # 낱낱이 전수 수색
            df = pd.read_excel(f_path, engine='xlrd', header=None)
            found = False
            for row in df.values:
                row_str = " ".join([str(v) for v in row])
                if '삼성' in row_str or '메리츠' in row_str or '޸' in row_str or 'Ｚ' in row_str:
                    found = True
                    break
            
            if found:
                print(f"  [FOUND] {f_name}")
                found_files.append(f_name)
        except:
            continue
            
    print("-" * 50)
    print(f"[*] SEARCH COMPLETE: {len(found_files)} files contain keywords.")

if __name__ == "__main__":
    find_samsung_meritz()
