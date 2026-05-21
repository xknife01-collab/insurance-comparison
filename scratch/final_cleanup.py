import pandas as pd
import os

file_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

try:
    df = pd.read_csv(file_path, encoding='utf-8-sig')
    
    def get_premium(val):
        if pd.isna(val) or val == "": return 0
        val = str(val).replace(',', '').replace('원', '').strip()
        try:
            return float(val)
        except:
            return 0

    # Filter out rows where both premiums are 0
    df['m_val'] = df['Col_7'].apply(get_premium)
    df['f_val'] = df['Col_8'].apply(get_premium)
    
    # 1. Premium > 0
    df = df[(df['m_val'] > 0) | (df['f_val'] > 0)]
    
    # 2. Reasonable premium check (Filter out likely error data > 300,000 for surgery)
    # Most surgery/hospitalization packages are under 200k.
    df = df[(df['m_val'] < 300000) & (df['f_val'] < 300000)]
    
    # Drop temporary columns
    df = df.drop(columns=['m_val', 'f_val'])
    
    df.to_csv(file_path, index=False, encoding='utf-8-sig')
    print(f"Final cleanup done. Remaining rows: {len(df)}")

except Exception as e:
    print(f"Error: {e}")
