import pandas as pd
import os
import re

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"

def to_num(val):
    if pd.isna(val): return None
    s = str(val).replace(',', '').strip()
    try:
        return float(s)
    except:
        return None

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path): return
    
    df = pd.read_excel(path)
    
    ratios = []
    for i, row in df.iterrows():
        m_val = to_num(row.get('원본_열_6'))
        f_val = to_num(row.get('원본_열_7'))
        
        if m_val and f_val and f_val > 0:
            ratio = m_val / f_val
            ratios.append(ratio)
            
    if ratios:
        avg_ratio = sum(ratios) / len(ratios)
        max_ratio = max(ratios)
        min_ratio = min(ratios)
        print(f"Analysis of {len(ratios)} products:")
        print(f"Average Ratio (Male/Female): {avg_ratio:.2f}")
        print(f"Max Ratio: {max_ratio:.2f}")
        print(f"Min Ratio: {min_ratio:.2f}")
        
        # Breakdown by company if possible
        company_ratios = {}
        for i, row in df.iterrows():
            company = row['보험회사']
            m_val = to_num(row.get('원본_열_6'))
            f_val = to_num(row.get('원본_열_7'))
            if m_val and f_val and f_val > 0:
                if company not in company_ratios: company_ratios[company] = []
                company_ratios[company].append(m_val / f_val)
        
        print("\nAverage Ratio by Company:")
        for comp, rs in company_ratios.items():
            avg = sum(rs) / len(rs)
            print(f"- {comp}: {avg:.2f}")
    else:
        print("Could not calculate ratios.")

if __name__ == "__main__":
    main()
