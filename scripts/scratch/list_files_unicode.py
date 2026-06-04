import os

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
print(f"Total files: {len(files)}")
for f in sorted(files):
    # Print filename as-is and as a list of character codes to verify they are valid unicode
    print(f"File: {f} | Codes: {[ord(c) for c in f]}")
