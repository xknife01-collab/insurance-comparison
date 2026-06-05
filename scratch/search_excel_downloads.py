import os

downloads_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\downloads"

print("Searching for Excel/HTML files in downloads...")
found_files = []

for root, dirs, files in os.walk(downloads_dir):
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in ['.xls', '.xlsx', '.html', '.csv']:
            filepath = os.path.join(root, file)
            relpath = os.path.relpath(filepath, downloads_dir)
            found_files.append((relpath, os.path.getsize(filepath)))

if found_files:
    print(f"\nFound {len(found_files)} files:")
    for relpath, size in found_files[:30]:
        print(f"  - {relpath} ({size} bytes)")
    if len(found_files) > 30:
        print(f"  ... and {len(found_files) - 30} more files.")
else:
    print("\nNo Excel/HTML files found in downloads.")
