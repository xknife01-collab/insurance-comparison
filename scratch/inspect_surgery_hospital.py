import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
SURGERY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv"

def main():
    df = pd.read_csv(SURGERY_CSV)
    print("Columns in surgery_hospital/extracted_data.csv:")
    print(df.columns.tolist())
    
    rows = df[df["상품명"].astype(str).str.contains("환경쏘옥|효도쏘옥")]
    print(f"\nFound {len(rows)} matching rows in surgery_hospital:")
    for idx, row in rows.iterrows():
        print(f"Prod: {row['상품명']} | Cov: {row.get('담보명(급부명)', row.get('담보명', ''))} | Base: {row.get('기준보험료', '')} | Join: {row.get('가입보험료', '')}")
        
if __name__ == "__main__":
    main()
