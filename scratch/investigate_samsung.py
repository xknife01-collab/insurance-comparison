import pandas as pd
import os

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_최종.xlsx"

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path):
        print("File not found.")
        return
    
    df = pd.read_excel(path)
    
    # Filter for the specific product
    rows = df[df['상품명'].str.contains("태평성대", na=False)]
    
    print(f"Found {len(rows)} matching rows.\n")
    
    for i, row in rows.iterrows():
        print(f"--- Row {i} ---")
        for col in df.columns:
            val = row[col]
            if pd.notna(val) and str(val).strip() != "" and str(val).strip() != "-":
                print(f"{col}: {val}")
        print("\n")

if __name__ == "__main__":
    main()
