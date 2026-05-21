import pandas as pd
import os
import re

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"
output_file = "뇌보험_담보_통합_최종_성별분리.xlsx"

DEFAULT_RATIO = 1.32 # Male / Female

def to_num(val):
    if pd.isna(val): return None
    s = str(val).replace(',', '').strip()
    try:
        # Check if it contains multiple numbers or non-numeric stuff
        match = re.search(r'\d+', s)
        if match:
            return float(s)
    except:
        pass
    return None

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path):
        print("File not found.")
        return
    
    df = pd.read_excel(path)
    
    new_rows = []
    for _, row in df.iterrows():
        m_val = to_num(row.get('원본_열_6'))
        f_val = to_num(row.get('원본_열_7'))
        
        main_amt = to_num(row.get('지급금액'))
        if main_amt is None:
            main_amt = to_num(row.get('가입금액'))
            
        # Decision Logic:
        # 1. If both original gender values exist, use them.
        if m_val and f_val and m_val > 1000 and f_val > 1000: # Simple threshold to avoid units like '1000'
            final_male = m_val
            final_female = f_val
        # 2. If only one exists, calculate the other.
        elif m_val and m_val > 1000:
            final_male = m_val
            final_female = m_val / DEFAULT_RATIO
        elif f_val and f_val > 1000:
            final_female = f_val
            final_male = f_val * DEFAULT_RATIO
        # 3. If neither exists but main amount exists, assume it's Male.
        elif main_amt and main_amt > 1000:
            final_male = main_amt
            final_female = main_amt / DEFAULT_RATIO
        else:
            final_male = 0
            final_female = 0
            
        row_dict = row.to_dict()
        row_dict['남성보험료'] = round(final_male)
        row_dict['여성보험료'] = round(final_female)
        new_rows.append(row_dict)
        
    res_df = pd.DataFrame(new_rows)
    
    # Reorder columns to put gender premiums at the front
    cols = list(res_df.columns)
    # Move '남성보험료', '여성보험료' to after '담보명(급부명)'
    insert_idx = cols.index('담보명(급부명)') + 1 if '담보명(급부명)' in cols else 3
    
    gender_cols = ['남성보험료', '여성보험료']
    for c in gender_cols:
        cols.remove(c)
        
    for i, c in enumerate(gender_cols):
        cols.insert(insert_idx + i, c)
        
    res_df = res_df[cols]
    
    out_path = os.path.join(dir_path, output_file)
    res_df.to_excel(out_path, index=False)
    
    print(f"Processed {len(res_df)} rows.")
    print(f"Saved to: {output_file}")

if __name__ == "__main__":
    main()
