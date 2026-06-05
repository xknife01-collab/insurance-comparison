import pandas as pd
import numpy as np
import re

CSV_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.csv"

def extract_number(val_str):
    if pd.isna(val_str):
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s:
        return 0
    try:
        return float(s)
    except:
        # extract first number
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def format_number(num):
    if num == 0:
        return ""
    if num.is_integer():
        return f"{int(num):,} 원"
    else:
        return f"{int(num):,} 원"

def main():
    df = pd.read_csv(CSV_FILE)
    
    # We will group by Source_file, 보험회사, 상품명
    # And we will collapse them into a single row per product
    
    grouped = []
    
    for (src, comp, prod), group in df.groupby(['source_file', '보험회사', '상품명']):
        # get the first row to use as base for other columns
        base_row = group.iloc[0].copy()
        
        sum_std = 0
        sum_act = 0
        
        for _, row in group.iterrows():
            std_val = extract_number(row.get('기준보험료', ''))
            act_val = extract_number(row.get('가입보험료', ''))
            sum_std += std_val
            sum_act += act_val
            
        # Is it annual? 
        # User specified: Kyobo Life Planet, Samsung Life are 1-year.
        # Generally, if it's life insurance (file_16.xls) and sum > 100,000, it's annual
        is_annual = False
        if src == 'file_16.xls':
            if comp in ['교보라이프플래닛생명', '삼성생명', '교보생명', '동양생명', '메트라이프생명']:
                if sum_std > 100000 or sum_act > 100000:
                    is_annual = True
        
        if is_annual:
            sum_std /= 12
            sum_act /= 12
            
        base_row['기준보험료'] = format_number(sum_std)
        base_row['가입보험료'] = format_number(sum_act)
        base_row['구분'] = '주계약+특약 종합'
        base_row['담보명(급부명)'] = '종합보장'
        
        grouped.append(base_row)
        
    out_df = pd.DataFrame(grouped)
    print(f"Original rows: {len(df)}, Combined rows: {len(out_df)}")
    
    # check Kyobo and Samsung
    test = out_df[out_df['보험회사'].isin(['교보라이프플래닛생명', '삼성생명'])]
    for _, row in test.iterrows():
        print(f"{row['보험회사']} - {row['상품명']}: 기준 {row['기준보험료']}, 가입 {row['가입보험료']}")

if __name__ == "__main__":
    main()
