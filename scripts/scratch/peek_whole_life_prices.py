import pandas as pd

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\whole_life\extracted_data.csv"

def summarize():
    df = pd.read_csv(file_path)
    
    print("Unique Products and Premiums:")
    # Group by insurance company and product name
    grouped = df.groupby(['보험회사', '상품명'])
    
    for (company, product), group in grouped:
        # Standard and Joined Premium columns
        std_prems = group['기준보험료'].dropna().tolist()
        act_prems = group['가입보험료'].dropna().tolist()
        
        # Clean and print
        print(f"\n[{company}] {product}")
        print(f"  - Rows count: {len(group)}")
        if std_prems:
            print(f"  - 기준보험료 samples: {std_prems[:5]}")
        if act_prems:
            print(f"  - 가입보험료 samples: {act_prems[:5]}")

if __name__ == "__main__":
    summarize()
