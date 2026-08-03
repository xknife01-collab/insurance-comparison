import pandas as pd
import os

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path): return
    
    df = pd.read_excel(path)
    unique_products = df[['보험회사', '상품명']].drop_duplicates()
    
    print(f"Total entries: {len(df)}")
    print(f"Unique products: {len(unique_products)}")
    print("\nListing all unique products:")
    for i, row in unique_products.iterrows():
        print(f"- {row['보험회사']}: {row['상품명']}")

if __name__ == "__main__":
    main()
