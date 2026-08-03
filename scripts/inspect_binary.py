
import pandas as pd
import os

def inspect_binary_xls(filepath):
    print(f"\n[*] Inspecting binary file: {os.path.basename(filepath)}")
    try:
        # Try reading with xlrd
        df = pd.read_excel(filepath, engine='xlrd')
        print(f"  [OK] Loaded with {df.shape[0]} rows and {df.shape[1]} columns.")
        print(f"  [Cols]: {df.columns.tolist()[:10]}")
        print(f"  [First 5 rows]:\n{df.head(5)}")
        
        # Check for Age-like columns (0-100)
        age_indicators = [c for c in df.columns if any(str(x) in str(c) for x in range(20, 80))]
        if age_indicators:
            print(f"  [!] Found potential age columns: {age_indicators[:10]}")
            
    except Exception as e:
        print(f"  [-] Failed to read: {e}")

def main():
    root = 'scripts/scraper/raw_data'
    target = '장기보장성 비교 공시 (7).xls'
    inspect_binary_xls(os.path.join(root, target))

if __name__ == "__main__":
    main()
