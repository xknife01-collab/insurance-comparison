import pandas as pd
import os
import re

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"

def clean_val(val):
    return str(val).strip() if pd.notna(val) and str(val).strip() != '-' else ""

def find_amount(row):
    # Search for something that looks like money in the original columns
    for i in range(20):
        val = str(row.get(f"원본_열_{i}", ""))
        if re.search(r'\d{1,3}(,\d{3})+', val) or (val.isdigit() and len(val) > 4):
            return val
    return ""

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path):
        print("File not found.")
        return
    
    df = pd.read_excel(path)
    
    results = []
    for _, row in df.iterrows():
        company = clean_val(row.get('보험회사', ""))
        product = clean_val(row.get('상품명', ""))
        coverage = clean_val(row.get('담보명(급부명)', ""))
        
        # If company/product is empty, try to get from original columns if possible
        # (Actually, they should be there from the previous fix)
        
        amount = clean_val(row.get('지급금액', ""))
        if not amount:
            amount = clean_val(row.get('가입금액', ""))
        if not amount:
            amount = find_amount(row)
            
        if product or coverage:
            results.append({
                "보험회사": company,
                "상품명": product,
                "담보명": coverage,
                "금액": amount
            })
            
    # Remove duplicates and empty rows
    res_df = pd.DataFrame(results).drop_duplicates()
    
    # Print as a nice table
    print(res_df.head(100).to_string(index=False))

if __name__ == "__main__":
    main()
