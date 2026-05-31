import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv'
out_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\output_analysis.txt'

def run():
    # Try reading with different encodings and write to out_path with utf-8
    for enc in ['utf-8-sig', 'cp949', 'euc-kr']:
        try:
            df = pd.read_csv(csv_path, header=None, encoding=enc)
            print(f"Success reading with {enc}")
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(f"Read success with {enc}\n")
                f.write(f"Shape: {df.shape}\n")
                f.write(f"Columns: {df.iloc[0].tolist()}\n\n")
                
                riders = df.iloc[1:, 3].dropna().unique()
                f.write(f"Total unique riders: {len(riders)}\n")
                f.write("Sample riders (first 40):\n")
                for r in list(riders)[:40]:
                    f.write(f"  - {r}\n")
                
                # Check for "재가" or "시설"
                no_match = [r for r in riders if '재가' not in str(r) and '시설' not in str(r)]
                f.write(f"\nRiders not containing '재가' or '시설': {len(no_match)}\n")
                if no_match:
                    f.write("Sample non-matching riders:\n")
                    for r in no_match[:40]:
                        f.write(f"  - {r}\n")
            break
        except Exception as e:
            print(f"Failed with {enc}: {e}")

if __name__ == "__main__":
    run()
