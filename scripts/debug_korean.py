import pandas as pd

def debug_korean_search():
    file_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx'
    df = pd.read_excel(file_path)
    
    # Try multiple common Korean words to see what matches
    targets = ['연', '월', '보험료', '상품', '진단비']
    for t in targets:
        found = False
        for idx, row in df.iterrows():
            row_str = " ".join([str(v) for v in row.values])
            if t in row_str:
                print(f"[*] Found '{t}' in Row {idx}")
                found = True
                break
        if not found:
            print(f"[!] Could not find '{t}' in any row.")

if __name__ == "__main__":
    debug_korean_search()
