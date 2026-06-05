import os

downloads_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\downloads"

print("Scanning downloads folder recursively...")
for root, dirs, files in os.walk(downloads_dir):
    for file in files:
        filepath = os.path.join(root, file)
        relpath = os.path.relpath(filepath, downloads_dir)
        size = os.path.getsize(filepath)
        print(f"{relpath} ({size} bytes)")
