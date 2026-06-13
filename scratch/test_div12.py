import pandas as pd
import numpy as np

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

def clean_premium(val):
    if pd.isna(val) or val == '':
        return 0
    s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
    try:
        return float(s)
    except:
        return 0

df['male_clean'] = df['남성보험료'].apply(clean_premium)
df['female_clean'] = df['여성보험료'].apply(clean_premium)

# Let's simulate:
# 1. if co is non-life -> annual
# 2. if co is life -> if '주계약' in 구분 -> annual, else -> monthly
print("=== SIMULATED MONTHLY PREMIUMS FOR LIFE INSURERS ===")
for idx, r in df.drop_duplicates(subset=['보험회사', '상품명', '구분', '남성보험료']).iterrows():
    co = str(r['보험회사']).replace(" ", "")
    is_non_life = (co.endswith('손보') or co.endswith('화재') or co.endswith('해상') or '손해' in co or '손해보험' in co)
    if is_non_life:
        continue
    
    div = str(r['구분']).strip()
    m_raw = r['male_clean']
    
    if m_raw <= 0:
        continue
        
    if '주계약' in div:
        cycle = "연납"
        m_monthly = m_raw / 12
    else:
        cycle = "월납"
        m_monthly = m_raw
        
    print(f"Company: {co} | Product: {r['상품명']} | Div: {div} | Raw: {m_raw:,.0f} ({cycle}) -> Monthly: {m_monthly:,.0f}")
