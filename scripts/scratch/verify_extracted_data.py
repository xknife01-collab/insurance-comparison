import pandas as pd

FILEPATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"

def verify():
    df = pd.read_csv(FILEPATH)
    print(f"Total rows in extracted data: {len(df)}")
    print(f"Columns: {list(df.columns[:18])}")
    
    # Count how many rows have non-empty Male/Female premiums
    male_count = df['남성보험료'].notna().sum()
    # Wait, in pandas, read_csv might load empty values as NaN. Let's handle both NaN and empty strings.
    non_empty_male = df[df['남성보험료'].notna() & (df['남성보험료'] != "")]
    non_empty_female = df[df['여성보험료'].notna() & (df['여성보험료'] != "")]
    
    print(f"Number of rows with male premiums: {len(non_empty_male)}")
    print(f"Number of rows with female premiums: {len(non_empty_female)}")
    
    print("\n--- Sample rows with explicit gender premiums (Double-Header layout) ---")
    if len(non_empty_male) > 0:
        sample = non_empty_male[['보험회사', '상품명', '담보명(급부명)', '남성보험료', '여성보험료', '기준보험료', '가입보험료', 'source_file']].head(5)
        print(sample.to_string())
    else:
        print("None found!")
        
    print("\n--- Sample rows with standard premiums (Standard/Headerless layout) ---")
    standard_rows = df[(df['남성보험료'].isna() | (df['남성보험료'] == "")) & (df['기준보험료'].notna() & (df['기준보험료'] != ""))]
    if len(standard_rows) > 0:
        sample = standard_rows[['보험회사', '상품명', '담보명(급부명)', '남성보험료', '여성보험료', '기준보험료', '가입보험료', 'source_file']].head(5)
        print(sample.to_string())
    else:
        print("None found!")

if __name__ == "__main__":
    verify()
