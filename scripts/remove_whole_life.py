import pandas as pd
import os
import warnings

warnings.filterwarnings('ignore')

TARGET_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"

def remove_whole_life_final_v2():
    if not os.path.exists(TARGET_FILE): return
    
    print("Loading excel for aggressive cleanup (v2)...")
    try:
        df = pd.read_excel(TARGET_FILE).astype(object)
    except Exception as e:
        print(f"Error loading file: {e}. Please make sure the file is closed.")
        return
    
    EXCLUDE_KEYWORDS = ["종신", "유니버설", "CI", "GI", "변액", "연금", "저축", "유족", "사망", "우리아이", "어린이"]
    
    initial_count = len(df)
    
    def should_exclude(row):
        text = str(row.iloc[1]) + " " + str(row.iloc[3]) + " " + str(row.get('상세안내', ''))
        return any(kw in text for kw in EXCLUDE_KEYWORDS)

    df_cleaned = df[~df.apply(should_exclude, axis=1)]
    removed_count = initial_count - len(df_cleaned)
    
    try:
        df_cleaned.to_excel(TARGET_FILE, index=False)
        print(f"Cleanup complete. Removed {removed_count} rows.")
    except Exception as e:
        print(f"Error saving file: {e}. Please close the Excel file and try again.")

if __name__ == "__main__":
    remove_whole_life_final_v2()
