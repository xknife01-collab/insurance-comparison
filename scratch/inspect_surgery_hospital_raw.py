import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
SURGERY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv"

def main():
    df = pd.read_csv(SURGERY_CSV)
    
    # Check Col_1 for keywords
    matching_indices = []
    for idx, val in enumerate(df["Col_1"]):
        val_str = str(val)
        if any(kw in val_str for kw in ["환경쏘옥", "효도쏘옥", "효밍아웃"]):
            matching_indices.append(idx)
            
    print(f"Found {len(matching_indices)} matching rows in surgery_hospital/extracted_data.csv:")
    for idx in matching_indices:
        row = df.iloc[idx]
        non_empty = {f"Col_{i}": row[f"Col_{i}"] for i in range(30) if pd.notna(row[f"Col_{i}"])}
        print(f"Row {idx}: {non_empty}")

if __name__ == "__main__":
    main()
