import pandas as pd
import sys

def dump_all_text():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    # Dump to a text file with explicit encoding
    with open('excel_dump.txt', 'w', encoding='utf-8') as f:
        for idx, row in df.iterrows():
            line = f"Row {idx}: " + " | ".join([str(v) for v in row.values]) + "\n"
            f.write(line)
    
    print("[*] Dumped all Excel text to excel_dump.txt")

if __name__ == "__main__":
    dump_all_text()
