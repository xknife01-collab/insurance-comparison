import os

files = [
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_0.xls',
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_10.xls',
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_30.xls'
]

for f_path in files:
    if os.path.exists(f_path):
        with open(f_path, 'rb') as f:
            sig = f.read(20)
            print(f"{os.path.basename(f_path)} signature: {sig}")
    else:
        print(f"Not found: {f_path}")
