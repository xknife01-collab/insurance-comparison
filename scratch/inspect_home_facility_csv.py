import pandas as pd

def run():
    csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv'
    df = pd.read_csv(csv_path)
    print(f"Shape: {df.shape}")
    print(df.columns)
    
    # Print distinct companies and products
    print("\nDistinct Companies & Products:")
    print(df[['보험회사', '상품명']].drop_duplicates())
    
    # Group by company and product and show sample rows
    for (co, prod), sub in df.groupby(['보험회사', '상품명']):
        print(f"\n★ Company: {co} | Product: {prod} ({len(sub)} rows)")
        for idx, row in sub.iterrows():
            print(f"  Row {idx}: {row.get('구분', '')} | {row.get('담보명(급부명)', '')} | {row.get('가입금액', '')} | Male: {row.get('기준보험료', '')} | Female: {row.get('가입보험료', '')} | source: {row.get('source_file', '')}")

if __name__ == '__main__':
    run()
