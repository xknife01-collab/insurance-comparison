import os

files = [
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_0.xls',
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls'
]

for f_path in files:
    if os.path.exists(f_path):
        with open(f_path, 'rb') as f:
            data = f.read(500)
            print(f"--- {os.path.basename(f_path)} (First 500 bytes) ---")
            print(data)
            print("\n")
