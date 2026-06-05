import pandas as pd
import re
import os

CSV_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data.csv"
OUT_CSV = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\child\extracted_data_combined.csv"

def extract_number(val_str):
    if pd.isna(val_str):
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s:
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def main():
    df = pd.read_csv(CSV_FILE)
    
    # We will combine main contract and riders for ALL products to make it easy to compare
    # as child insurance is mostly sold as a package.
    
    combined_rows = []
    
    for (src, comp, prod), group in df.groupby(['source_file', '보험회사', '상품명']):
        base_row = group.iloc[0].copy()
        
        sum_std = sum(extract_number(row.get('기준보험료', '')) for _, row in group.iterrows())
        sum_act = sum(extract_number(row.get('가입보험료', '')) for _, row in group.iterrows())
        
        # Check if annual premium (sum > 100,000 for Life Insurance)
        is_annual = False
        if src == 'file_16.xls':
            if sum_std > 100000 or sum_act > 100000:
                is_annual = True
                
        if is_annual:
            sum_std /= 12
            sum_act /= 12
            
        base_row['기준보험료'] = f"{int(sum_std):,} 원" if sum_std > 0 else ""
        base_row['가입보험료'] = f"{int(sum_act):,} 원" if sum_act > 0 else ""
        base_row['구분'] = '종합'
        base_row['담보명(급부명)'] = '주계약 및 특약 합산'
        
        combined_rows.append(base_row)
        
    out_df = pd.DataFrame(combined_rows)
    out_df.to_csv(OUT_CSV, index=False, encoding='utf-8-sig')
    print(f"Original rows: {len(df)}, Combined rows: {len(out_df)}")
    
    # Verify Samsung and Kyobo
    for idx, row in out_df[out_df['보험회사'].isin(['교보라이프플래닛생명', '삼성생명'])].iterrows():
        print(f"{row['보험회사']} - {row['상품명']}: 기준 {row['기준보험료']}, 가입 {row['가입보험료']}")

if __name__ == "__main__":
    main()
