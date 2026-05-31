import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    with open(csv_path, 'rb') as f:
        raw = f.read(1000)
    
    encodings = ['utf-8-sig', 'utf-8', 'cp949', 'utf-16', 'euc-kr', 'latin-1']
    for enc in encodings:
        try:
            text = raw.decode(enc)
            print(f"[✔] Decoded successfully with: {enc}")
            print(text[:200])
            print("-" * 50)
        except Exception as e:
            print(f"[X] Failed with: {enc} ({e})")

if __name__ == "__main__":
    run()
