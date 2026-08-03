import pandas as pd
import os
import re

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path): return
    
    df = pd.read_excel(path)
    
    # Check for male/female columns in original data
    # We look at the first few rows to see if there are two numbers that look like premiums
    samples = []
    for i, row in df.head(20).iterrows():
        amounts = []
        for j in range(20):
            val = str(row.get(f"원본_열_{j}", ""))
            if re.search(r'\d{1,3}(,\d{3})+', val):
                amounts.append((j, val))
        
        if len(amounts) >= 2:
            samples.append({
                "Product": row['상품명'],
                "Amount1": amounts[0][1],
                "Amount2": amounts[1][1],
                "ColIndices": [a[0] for a in amounts]
            })
            
    if samples:
        print("Found rows with multiple amounts (potential Male/Female):")
        for s in samples:
            print(f"- {s['Product']}: {s['Amount1']} vs {s['Amount2']} (Indices: {s['ColIndices']})")
    else:
        print("No obvious Male/Female split found in the first few rows.")

if __name__ == "__main__":
    main()
