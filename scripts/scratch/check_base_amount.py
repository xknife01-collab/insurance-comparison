# -*- coding: utf-8 -*-
import pandas as pd

def check_base_to_file():
    df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv")
    cols = list(df.columns)
    
    with open("scripts/scratch/product_info.txt", "w", encoding="utf-8") as f:
        f.write("Columns:\n" + str(cols) + "\n\n")
        
        # Print first few rows to inspect column values
        for idx, row in df.head(15).iterrows():
            f.write(f"Prod: {row[cols[1]]} | Dambor: {row[cols[3]]} | Col5: {row[cols[5]]} | Col6: {row[cols[6]]} | Col7: {row[cols[7]]} | Col8: {row[cols[8]]}\n")

if __name__ == "__main__":
    check_base_to_file()
