import pandas as pd
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

with open("scratch/life_max_premiums.txt", "w", encoding="utf-8") as f:
    f.write("=== MAX PREMIUM BY LIFE INSURER ===\n")
    for co in df['보험회사'].unique():
        co_clean = str(co).replace(" ", "").strip()
        is_non_life = (co_clean.endswith('손보') or co_clean.endswith('화재') or co_clean.endswith('해상') or '손해' in co_clean or '손해보험' in co_clean)
        if is_non_life:
            continue
        
        co_df = df[df['보험회사'] == co]
        max_prem = co_df['male_clean'].max()
        f.write(f"Company: {co_clean:15s} | Max Premium: {max_prem:,.0f} 원\n")
print("Wrote to scratch/life_max_premiums.txt")
