import pandas as pd

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\whole_life\extracted_data.csv"

def peek():
    df = pd.read_csv(file_path)
    
    # Let's filter some rows and display the standard columns and corresponding raw columns
    # to understand what values standard columns mapped to
    samples = df[['보험회사', '상품명', '기준보험료', '가입보험료', '원본_열_5', '원본_열_6', '원본_열_7', '원본_열_8', '원본_열_9', '원본_열_10']].dropna().head(10)
    print(samples.to_string())

if __name__ == "__main__":
    peek()
