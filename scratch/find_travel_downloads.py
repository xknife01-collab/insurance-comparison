import os

downloads_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\downloads"
keywords = ["여행", "travel", "국내", "해외"]

print("Searching for files with travel keywords in downloads...")
found_files = []

for root, dirs, files in os.walk(downloads_dir):
    for file in files:
        # Avoid print encoding errors by handling characters properly
        for kw in keywords:
            if kw.lower() in file.lower():
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, downloads_dir)
                found_files.append((relpath, os.path.getsize(filepath)))
                break

if found_files:
    print(f"\nFound {len(found_files)} files matching keywords:")
    for relpath, size in found_files:
        print(f"  - {relpath} ({size} bytes)")
else:
    print("\nNo travel-related files found in downloads.")
