import pandas as pd
import os

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'
input_file = "뇌보험_담보_통합_new.xlsx"
output_file = "뇌보험_담보_통합_최종.xlsx"

def main():
    path = os.path.join(dir_path, input_file)
    if not os.path.exists(path):
        print(f"File not found: {input_file}")
        return
    
    df = pd.read_excel(path)
    initial_count = len(df)
    
    # Define exclusion keywords
    child_keywords = ["어린이", "자녀", "아이", "키즈", "LOVE", "꿈나무", "청소년", "주니어", "태아"]
    sick_keywords = ["유병자", "간편", "3.1", "3.2", "3.3", "3.4", "3.5", "심사통과", "병력", "간편가입", "간편심사"]
    
    all_exclude = child_keywords + sick_keywords
    
    # Filter out by keywords
    mask_exclude = df['상품명'].str.contains('|'.join(all_exclude), case=False, na=False)
    
    # Filter out rows with no amount
    # We check '지급금액', '가입금액' and also check if there's any number in original columns if we want to be thorough,
    # but the user specifically mentioned rows showing '-' in the display.
    
    def has_amount(row):
        # Check explicit columns
        if pd.notna(row['지급금액']) and str(row['지급금액']).strip() not in ["", "-", "0"]: return True
        if pd.notna(row['가입금액']) and str(row['가입금액']).strip() not in ["", "-", "0"]: return True
        # Check original columns for any currency-like string as a fallback
        for i in range(20):
            val = str(row.get(f"원본_열_{i}", ""))
            if re.search(r'\d{1,3}(,\d{3})+', val): return True
        return False

    import re
    mask_no_amount = ~df.apply(has_amount, axis=1)
    
    # Combined exclusion mask
    mask_final_exclude = mask_exclude | mask_no_amount
    
    excluded_df = df[mask_final_exclude]
    filtered_df = df[~mask_final_exclude]
    
    final_count = len(filtered_df)
    removed_count = initial_count - final_count
    
    out_path = os.path.join(dir_path, output_file)
    filtered_df.to_excel(out_path, index=False)
    
    print(f"Initial rows: {initial_count}")
    print(f"Removed rows: {removed_count}")
    print(f"Final rows: {final_count}")
    print(f"Saved to: {output_file}")
    
    if removed_count > 0:
        print("\nExamples of removed products:")
        print(excluded_df['상품명'].unique()[:10])

if __name__ == "__main__":
    main()
