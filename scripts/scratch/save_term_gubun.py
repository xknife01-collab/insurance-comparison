import pandas as pd

csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\variable_term\extracted_data.csv"
try:
    df = pd.read_csv(csv_path)
    term_df = df[df['sub_type'].isin(['term_pure', 'term_ceo', 'variable_term'])]
    
    with open("scripts/scratch/check_term_gubun_results.txt", "w", encoding="utf-8") as f:
        f.write(f"Total term-like rows: {len(term_df)}\n")
        f.write("Unique values of '구분' for term-like products:\n")
        for val, count in term_df['구분'].value_counts().items():
            f.write(f"  {val}: {count}\n")
            
        f.write("\nLet's print some sample rows where sub_type is term-like:\n")
        cols = ['보험회사', '상품명', '구분', '가입금액', '기준보험료', '가입보험료', 'source_file']
        sample_df = term_df[cols].head(30)
        f.write(sample_df.to_string())
except Exception as e:
    with open("scripts/scratch/check_term_gubun_results.txt", "w", encoding="utf-8") as f:
        f.write(f"Error: {e}")
