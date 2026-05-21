import pandas as pd
import re

def show_sorted_premiums():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx'
    df = pd.read_excel(file_path, header=None)
    
    def clean(val):
        if pd.isna(val): return 0
        s = str(val).replace(',', '').replace('원', '').replace(' ', '').strip()
        match = re.search(r'(\d+)', s)
        return int(match.group(1)) if match else 0

    df['m'] = df[6].apply(clean)
    df['f'] = df[7].apply(clean)
    
    summary = df.groupby(1).agg({'m': 'sum', 'f': 'sum'}).reset_index()
    
    # Filter realistic monthly premiums
    summary = summary[(summary['m'] >= 5000) & (summary['m'] <= 80000)].sort_values('m')
    
    print("\n[★] 보험료 낮은 순 리스트 (주계약 + 특약 합산):")
    print("-" * 70)
    print(f"{'순위':<4} | {'보험료(남)':<10} | {'보험료(여)':<10} | {'상품명'}")
    print("-" * 70)
    
    for i, (_, row) in enumerate(summary.iterrows(), 1):
        name = str(row[1])
        print(f"{i:<4} | {row['m']:>8,}원 | {row['f']:>8,}원 | {name}")

if __name__ == "__main__":
    show_sorted_premiums()
