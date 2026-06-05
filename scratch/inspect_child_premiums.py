import pandas as pd
import os
import re

DATA_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.csv"
REPORT_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\child_premiums_report.txt"

def parse_val(v):
    if pd.isna(v): return 0
    clean_v = str(v).replace(",", "").replace("원", "").replace(" ", "").strip()
    if not clean_v or clean_v == "-":
        return 0
    try:
        # Handle decimal strings
        if "." in clean_v:
            return int(float(clean_v))
        return int(clean_v)
    except:
        # Handle cases with text
        nums = re.findall(r'\d+', clean_v)
        if nums:
            return int(nums[0])
        return 0

def main():
    if not os.path.exists(DATA_FILE):
        print(f"[ERR] Data file not found: {DATA_FILE}")
        return
        
    df = pd.read_csv(DATA_FILE)
    print(f"[*] Loaded child data: {len(df)} rows")
    
    # Pre-parse premium columns
    df['기준보험료_int'] = df['기준보험료'].apply(parse_val)
    df['가입보험료_int'] = df['가입보험료'].apply(parse_val)
    
    # Identify PC vs Life insurance companies
    # PC (Non-life) insurers in our list:
    pc_insurers = ["메리츠화재", "한화손보", "롯데손보", "흥국화재", "삼성화재", "현대해상", "KB손보", "DB손보", "카카오페이손보", "농협손보"]
    
    # Group by (보험회사, 상품명)
    groups = df.groupby(["보험회사", "상품명"])
    
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(f"총 추출된 어린이/태아보험 상품 수: {len(groups)}\n")
        f.write("=" * 80 + "\n\n")
        
        for idx, ((company, prod_name), group) in enumerate(sorted(groups, key=lambda x: (x[0][0], x[0][1]))):
            f.write(f"[{idx+1}] {company} - {prod_name}\n")
            f.write(f"  - 소스파일: {group['source_file'].iloc[0]}\n")
            
            # Check if this company is a property-casualty insurer
            is_pc = any(pc in company for pc in pc_insurers)
            
            # Print main details
            main_rows = group[group['구분'].str.contains("주계약", na=False)]
            rider_rows = group[group['구분'].str.contains("특약", na=False)]
            
            # If no 구분 column contains 주계약/특약, treat all as general items (PC insurance generally has no main contract/rider separation in this way)
            if len(main_rows) == 0 and len(rider_rows) == 0:
                rider_rows = group
                
            if len(main_rows) > 0:
                f.write("  [주계약 담보]\n")
                # Deduplicate similar rows to make report clean
                seen_main = set()
                for _, r in main_rows.iterrows():
                    dname = r['담보명(급부명)']
                    if dname in seen_main:
                        continue
                    seen_main.add(dname)
                    if is_pc:
                        f.write(f"    - {dname}: 남아 {r['기준보험료_int']:,}원 / 여아 {r['가입보험료_int']:,}원\n")
                    else:
                        f.write(f"    - {dname}: 기준 {r['기준보험료_int']:,}원 / 가입 {r['가입보험료_int']:,}원\n")
                        
            if len(rider_rows) > 0:
                title = "  [특약 담보]" if len(main_rows) > 0 else "  [보장 담보 목록]"
                f.write(f"{title}\n")
                
                # Sort riders by premium to show most important ones
                rider_sorted = rider_rows.sort_values(by="기준보험료_int", ascending=False)
                seen_riders = set()
                count = 0
                for _, r in rider_sorted.iterrows():
                    dname = r['담보명(급부명)']
                    if dname in seen_riders:
                        continue
                    seen_riders.add(dname)
                    count += 1
                    if count <= 8:  # Show top 8 coverages
                        if is_pc:
                            f.write(f"    - {dname}: 남아 {r['기준보험료_int']:,}원 / 여아 {r['가입보험료_int']:,}원\n")
                        else:
                            f.write(f"    - {dname}: 기준 {r['기준보험료_int']:,}원 / 가입 {r['가입보험료_int']:,}원\n")
                    else:
                        break
                if len(seen_riders) > 8:
                    f.write(f"    ...외 {len(seen_riders)-8}개 특약/담보\n")
            
            # Aggregate premiums without duplication
            sum_std = 0
            sum_act = 0
            
            if is_pc:
                # For PC insurers, the package premium is listed on the first row of the product (subsequent rows are nan / 0)
                # Let's take the maximum premium value in the group
                sum_std = group["기준보험료_int"].max()
                sum_act = group["가입보험료_int"].max()
            else:
                # For Life insurers:
                # 1. Main Contract (주계약): take the premium from the first row of 주계약
                main_rows = group[group['구분'].str.contains("주계약", na=False)]
                if len(main_rows) > 0:
                    sum_std += main_rows["기준보험료_int"].iloc[0]
                    sum_act += main_rows["가입보험료_int"].iloc[0]
                
                # 2. Riders (특약): take the premium of the first row of each unique rider name
                rider_rows = group[group['구분'].str.contains("특약", na=False)]
                if len(rider_rows) > 0:
                    unique_riders = rider_rows.drop_duplicates(subset=["담보명(급부명)"])
                    sum_std += unique_riders["기준보험료_int"].sum()
                    sum_act += unique_riders["가입보험료_int"].sum()
                
                # 3. If there is no 구분 specifying 주계약/특약:
                if len(main_rows) == 0 and len(rider_rows) == 0:
                    unique_dnames = group.drop_duplicates(subset=["담보명(급부명)"])
                    non_zero_std = unique_dnames[unique_dnames["기준보험료_int"] > 0]["기준보험료_int"].tolist()
                    non_zero_act = unique_dnames[unique_dnames["가입보험료_int"] > 0]["가입보험료_int"].tolist()
                    
                    if len(set(non_zero_std)) == 1:
                        sum_std = non_zero_std[0]
                    else:
                        sum_std = unique_dnames["기준보험료_int"].sum()
                        
                    if len(set(non_zero_act)) == 1:
                        sum_act = non_zero_act[0]
                    else:
                        sum_act = unique_dnames["가입보험료_int"].sum()
            
            if is_pc:
                f.write(f"  -> 합계(가입된 담보 단순합산): 남아 {sum_std:,}원 / 여아 {sum_act:,}원\n")
            else:
                f.write(f"  -> 합계(가입된 담보 단순합산): 기준 {sum_std:,}원 / 가입 {sum_act:,}원\n")
            f.write("-" * 50 + "\n\n")
            
    print(f"[+] Report generated: {REPORT_FILE}")

if __name__ == "__main__":
    main()
