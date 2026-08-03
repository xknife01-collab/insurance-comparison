import os
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

BASE_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_FILE = os.path.join(BASE_PATH, "insurance-comparison-main", "insurance_data", "1_guaranteed", "heart", "heart_extracted_data.xlsx")

def investigate():
    if not os.path.exists(TARGET_FILE): return
    df = pd.read_excel(TARGET_FILE)
    
    # 사용자가 언급한 행들 (1-indexed -> 0-indexed로 변환)
    rows_to_check = [575, 576, 577, 1038, 1054, 1055, 1062, 1063]
    
    for r_num in rows_to_check:
        idx = r_num - 2 # Excel Row 575 is df.iloc[573]
        if idx < len(df):
            row = df.iloc[idx]
            print(f"\n[Row {r_num}] Source: {row['source_file']}")
            # 원본 열 중 데이터가 있는 것만 출력
            origins = {f"col_{i}": row[f"원본_열_{i}"] for i in range(30) if pd.notna(row[f"원본_열_{i}"]) and str(row[f"원본_열_{i}"]).strip() != ""}
            print(f"Origins: {origins}")
            print(f"Current mapping: Co={row.iloc[0]}, Prod={row.iloc[1]}, Gu={row.iloc[2]}, Dam={row.iloc[3]}")

if __name__ == "__main__":
    investigate()
