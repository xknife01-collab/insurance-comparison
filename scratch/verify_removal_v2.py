import pandas as pd
import os
import time

dir_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain'

def get_file_info(file_name):
    path = os.path.join(dir_path, file_name)
    if not os.path.exists(path): return None
    mtime = os.path.getmtime(path)
    return {
        "name": file_name,
        "size": os.path.getsize(path),
        "mtime": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mtime))
    }

def analyze_file(file_name):
    path = os.path.join(dir_path, file_name)
    if not os.path.exists(path): return
    
    print(f"\n--- Analyzing: {file_name} ---")
    df = pd.read_excel(path) if file_name.endswith('.xlsx') else pd.read_csv(path)
    
    print(f"Total rows: {len(df)}")
    
    # List unique product names to see what's left
    unique_products = df['상품명'].unique().tolist()
    print(f"Unique Products Count: {len(unique_products)}")
    
    # Check for specific patterns
    child_patterns = ["어린이", "자녀", "아이", "키즈", "LOVE", "꿈나무", "청소년"]
    sick_patterns = ["유병자", "간편", "3.1", "3.2", "3.3", "3.4", "3.5", "심사통과", "병력", "Sickness", "Heal"]
    
    remaining_child = [p for p in unique_products if any(k.lower() in str(p).lower() for k in child_patterns)]
    remaining_sick = [p for p in unique_products if any(k.lower() in str(p).lower() for k in sick_patterns)]
    
    print(f"Remaining 'Children' related products: {len(remaining_child)}")
    if remaining_child:
        print("  - " + "\n  - ".join(remaining_child[:10]))
        
    print(f"Remaining 'Sick/Simplified' related products: {len(remaining_sick)}")
    if remaining_sick:
        print("  - " + "\n  - ".join(remaining_sick[:10]))

def main():
    files = ["뇌보험_담보_통합.xlsx", "뇌보험_담보_통합_new.xlsx", "extracted_data.csv"]
    for f in files:
        info = get_file_info(f)
        if info:
            print(f"File: {info['name']}, Size: {info['size']}, Last Modified: {info['mtime']}")
    
    # Check if there are any NEW xlsx files
    all_files = os.listdir(dir_path)
    for f in all_files:
        if f.endswith('.xlsx') and f not in files:
            info = get_file_info(f)
            print(f"Found other file: {info['name']}, Modified: {info['mtime']}")
            analyze_file(f)

    analyze_file("뇌보험_담보_통합_new.xlsx")

if __name__ == "__main__":
    main()
