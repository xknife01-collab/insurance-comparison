import pandas as pd

file_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

try:
    df = pd.read_csv(file_path, encoding='utf-8-sig')
    
    def get_premium(val):
        if pd.isna(val) or val == "": return 0
        val = str(val).replace(',', '').replace('원', '').strip()
        try: return float(val)
        except: return 0

    df['m_val'] = df['Col_7'].apply(get_premium)
    df['f_val'] = df['Col_8'].apply(get_premium)
    
    # Remove 0s but KEEP everything else
    df = df[(df['m_val'] > 0) | (df['f_val'] > 0)]
    
    # Show high premium products
    high_df = df[(df['m_val'] >= 300000) | (df['f_val'] >= 300000)]
    
    print(f"--- High Premium Products (>= 300,000 KRW) ---")
    if not high_df.empty:
        for _, row in high_df.iterrows():
            print(f"{row['Col_0']} | {row['Col_1']} | 남:{row['Col_7']} 여:{row['Col_8']}")
    else:
        print("No products found over 300,000 KRW.")
        
    # Save back without 0s
    df = df.drop(columns=['m_val', 'f_val'])
    df.to_csv(file_path, index=False, encoding='utf-8-sig')

except Exception as e:
    print(f"Error: {e}")
