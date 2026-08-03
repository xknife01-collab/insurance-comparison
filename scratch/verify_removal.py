import pandas as pd
import os

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'

def check_file(file_name):
    path = os.path.join(dir_path, file_name)
    if not os.path.exists(path):
        print(f"File not found: {file_name}")
        return
    
    try:
        if file_name.endswith('.csv'):
            df = pd.read_csv(path)
        else:
            df = pd.read_excel(path)
        
        print(f"\n--- Checking {file_name} ---")
        print(f"Total rows: {len(df)}")
        
        # Check for keywords
        child_keywords = ["어린이", "자녀", "아이", "키즈"]
        sick_keywords = ["유병자", "간편", "3.3.5", "3.2.5", "3.5.5", "심사통과", "병력"]
        
        child_count = df['상품명'].str.contains('|'.join(child_keywords), na=False).sum()
        sick_count = df['상품명'].str.contains('|'.join(sick_keywords), na=False).sum()
        
        print(f"Rows containing 'Children' keywords in Product Name: {child_count}")
        print(f"Rows containing 'Sick/Simplified' keywords in Product Name: {sick_count}")
        
        if child_count == 0 and sick_count == 0:
            print("Verified: No children or pre-existing condition insurance found in the current product list.")
        else:
            print("Note: Some rows still match these categories.")
            if child_count > 0:
                print("Samples (Children):", df[df['상품명'].str.contains('|'.join(child_keywords), na=False)]['상품명'].unique()[:5])
            if sick_count > 0:
                print("Samples (Sick):", df[df['상품명'].str.contains('|'.join(sick_keywords), na=False)]['상품명'].unique()[:5])
                
    except Exception as e:
        print(f"Error reading {file_name}: {e}")

def main():
    check_file("뇌보험_담보_통합.xlsx")
    check_file("뇌보험_담보_통합_new.xlsx")
    check_file("extracted_data.csv")

if __name__ == "__main__":
    main()
