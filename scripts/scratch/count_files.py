import os

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
print(f"Total files: {len(files)}")

# Count binary vs html
binary_count = 0
html_count = 0

for f in files:
    filepath = os.path.join(source_dir, f)
    try:
        with open(filepath, 'rb') as fp:
            content = fp.read(2000)
        if b'<table' in content.lower() or b'<html' in content.lower():
            html_count += 1
        else:
            binary_count += 1
    except Exception:
        pass

print(f"Binary files count: {binary_count}")
print(f"HTML files count: {html_count}")
