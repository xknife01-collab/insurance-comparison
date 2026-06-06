import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
ACCIDENT_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident\extracted_data.csv"

def main():
    df = pd.read_csv(ACCIDENT_CSV)
    rows = df[df["상품명"].str.contains("효밍아웃|효도쏘옥|환경쏘옥")]
    print(f"Found {len(rows)} matching rows:")
    for idx, row in rows.iterrows():
        print(f"Prod: {row['상품명']} | Cov: {row['담보명(급부명)']} | Base: {row['기준보험료']} | Join: {row['가입보험료']}")
            
if __name__ == "__main__":
    main()
