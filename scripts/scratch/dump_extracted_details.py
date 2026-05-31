import pandas as pd
import os

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

def run():
    if not os.path.exists(csv_path):
        print("CSV does not exist")
        return
        
    df = pd.read_csv(csv_path)
    
    # Group by product name and get unique riders
    products = df['상품명'].unique()
    print(f"Total Unique Products: {len(products)}")
    
    with open("c:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\scripts\\scratch\\extracted_products_riders.txt", "w", encoding="utf-8") as f:
        for p in sorted(products):
            f.write(f"\n========================================\nPRODUCT: {p}\n========================================\n")
            p_df = df[df['상품명'] == p]
            riders = p_df['담보명(급부명)'].unique()
            f.write(f"Company: {p_df['보험회사'].iloc[0]}\n")
            f.write(f"Source file: {p_df['source_file'].iloc[0]}\n")
            f.write("Riders:\n")
            for r in sorted(riders):
                f.write(f"  - {r}\n")
                
    print("Done. Dumped to extracted_products_riders.txt")

if __name__ == "__main__":
    run()
