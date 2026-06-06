import os
import pandas as pd
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

PROPERTY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.csv"
PROPERTY_XLSX = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.xlsx"
SURGERY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv"

def clean_premium_to_int(val_str):
    if pd.isna(val_str) or not val_str:
        return None
    cleaned = re.sub(r'[^\d]', '', str(val_str))
    if cleaned.isdigit():
        return int(cleaned)
    return None

def convert_premium_to_monthly(val_str):
    val_int = clean_premium_to_int(val_str)
    if val_int is not None:
        monthly_val = int(round(val_int / 12))
        return f"{monthly_val:,} 원"
    return val_str

def main():
    print("=== 1. Reading Property General Insurance (재물종합보험) Extracted Data ===")
    if not os.path.exists(PROPERTY_CSV):
        print(f"Error: {PROPERTY_CSV} does not exist!")
        return
        
    df_prop = pd.read_csv(PROPERTY_CSV)
    main_prop_rows = df_prop[df_prop["구분"] == "주계약"]
    
    print(f"Total Property products: {len(main_prop_rows)}")
    print("-" * 80)
    for idx, row in main_prop_rows.iterrows():
        comp = row["보험회사"]
        prod = row["상품명"]
        base_prem = row["기준보험료"]
        join_prem = row["가입보험료"]
        print(f"회사: {comp} | 상품명: {prod}")
        print(f"  남자 보험료 (기준): {base_prem} | 여자 보험료 (가입): {join_prem}")
        print("-" * 80)
        
    print("\n=== 2. Check if any Property Insurance is Annual ===")
    # Check if there are any yearly/annual clues in property insurance
    has_yearly = False
    for idx, row in main_prop_rows.iterrows():
        raw_vals = [str(row[f"원본_열_{i}"]) for i in range(30) if pd.notna(row[f"원본_열_{i}"])]
        raw_str = " ".join(raw_vals)
        if "연납" in raw_str or "1년납" in raw_str or "연보험료" in raw_str:
            print(f"  Possible annual product: {row['상품명']}")
            has_yearly = True
            
    if not has_yearly:
        print("  -> Checked all property products: All are monthly payment (월납) products. No conversion needed here.")
        
    # 3. Convert annual products in surgery_hospital/extracted_data.csv
    print("\n=== 3. Converting Annual products in surgery_hospital/extracted_data.csv ===")
    if os.path.exists(SURGERY_CSV):
        df_surg = pd.read_csv(SURGERY_CSV)
        target_prods = ["환경쏘옥NHe독감케어보험(무배당)", "효도쏘옥NHe부모님안심보험(무배당)", "효밍아웃NH부모님안전보험(무배당)_2404"]
        
        converted_count = 0
        for idx, row in df_surg.iterrows():
            prod_name = str(row["Col_1"]).strip()
            if prod_name in target_prods:
                # Convert Col_7 (Male premium) and Col_8 (Female premium)
                old_male = row["Col_7"]
                old_female = row["Col_8"]
                
                new_male = convert_premium_to_monthly(old_male)
                new_female = convert_premium_to_monthly(old_female)
                
                df_surg.at[idx, "Col_1"] = f"{prod_name} (월납)"
                df_surg.at[idx, "Col_7"] = new_male
                df_surg.at[idx, "Col_8"] = new_female
                
                # Update details in Col_24 to indicate monthly conversion
                old_details = str(row["Col_24"])
                new_details = old_details.replace("연납 기준입니다.", "월납 기준입니다 (연납 보험료를 12로 나누어 월납으로 변경함).")
                df_surg.at[idx, "Col_24"] = new_details
                
                print(f"Converted: {prod_name}")
                print(f"  Male Premium: {old_male} -> {new_male}")
                print(f"  Female Premium: {old_female} -> {new_female}")
                converted_count += 1
                
        if converted_count > 0:
            df_surg.to_csv(SURGERY_CSV, index=False, encoding='utf-8-sig')
            print(f"Successfully saved {converted_count} converted rows to {SURGERY_CSV}")
            # Also save to xlsx if it exists in the same folder
            xlsx_path = SURGERY_CSV.replace(".csv", ".xlsx")
            if os.path.exists(xlsx_path):
                df_surg.to_excel(xlsx_path, index=False)
                print(f"Successfully saved to {xlsx_path}")
        else:
            print("No matching annual products found to convert in surgery_hospital/extracted_data.csv")
    else:
        print(f"Warning: {SURGERY_CSV} does not exist.")

if __name__ == "__main__":
    main()
