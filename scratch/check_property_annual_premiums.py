import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
PROPERTY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.csv"

def main():
    df = pd.read_csv(PROPERTY_CSV)
    
    # Let's inspect unique products and their first rows (where premiums are populated)
    main_rows = df[df["구분"] == "주계약"]
    print(f"Total main contracts: {len(main_rows)}")
    
    for idx, row in main_rows.iterrows():
        comp = row["보험회사"]
        prod = row["상품명"]
        base_prem = row["기준보험료"]
        join_prem = row["가입보험료"]
        
        # Check raw row values to see if there are clues about payment cycles
        raw_vals = [str(row[f"원본_열_{i}"]) for i in range(30) if pd.notna(row[f"원본_열_{i}"])]
        raw_str = " ".join(raw_vals)
        
        cycle = "Unknown"
        if "월납" in raw_str:
            cycle = "월납"
        elif "연납" in raw_str or "1년납" in raw_str or "연보험료" in raw_str:
            cycle = "연납"
            
        print(f"Company: {comp} | Product: {prod}")
        print(f"  Male Premium (기준): {base_prem} | Female Premium (가입): {join_prem}")
        print(f"  Detected Cycle: {cycle}")
        print("-" * 50)

if __name__ == "__main__":
    main()
