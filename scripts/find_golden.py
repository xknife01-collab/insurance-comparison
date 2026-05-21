import pandas as pd
import glob
import os

def find_golden_carrier():
    raw_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"
    all_files = glob.glob(os.path.join(raw_dir, "*.xls"))
    
    print("-" * 60)
    print("[*] SEARCHING FOR ADULT UBJ SAMSUNG/MERITZ...")
    
    # [핵심] 치아(Dental)는 영구 차단, 진짜 건강보험만 추적
    health_kws = ['간편', '유병', '3.5.5', '355', '305', 'N5', '건강', '종합']
    carrier_kws = ['삼성', '메리츠', 'Ｚ', '޸', 'ȭ', 'ϳ', 'ȭ']
    
    for f_path in all_files:
        f_name = os.path.basename(f_path)
        if os.path.getsize(f_path) < 1000: continue
        try:
            df = pd.read_excel(f_path, engine='xlrd', header=None)
            for row in df.values:
                row_str = " ".join([str(v) for v in row])
                if any(ck in row_str for ck in carrier_kws) and any(hk in row_str for hk in health_kws):
                  if not any(bk in row_str for bk in ['치아', '펫', '자녀', '스타종합']):
                    print(f"  [GOLDEN FIND] {f_name}: {row_str[:80]}...")
                    break
        except: continue
    print("-" * 60)

if __name__ == "__main__":
    find_golden_carrier()
