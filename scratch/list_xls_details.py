import os
import re

folder = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(folder) if f.lower().endswith('.xls')]

print(f"Total files: {len(files)}")

# Let's inspect the files and write to a clean log
log_path = os.path.join(folder, "insurance-comparison-main", "scratch", "xls_list_details.txt")

with open(log_path, "w", encoding="utf-8") as f:
    f.write(f"Total .xls files: {len(files)}\n")
    f.write("-" * 80 + "\n")
    for filename in sorted(files):
        path = os.path.join(folder, filename)
        size = os.path.getsize(path)
        
        # Determine if HTML
        is_html = False
        try:
            with open(path, "rb") as bf:
                header = bf.read(200)
            header_text = header.decode('utf-8', errors='ignore').lower()
            if "<html" in header_text or "<table" in header_text or "xmlns:o=" in header_text:
                is_html = True
            else:
                header_utf16 = header.decode('utf-16', errors='ignore').lower()
                if "<html" in header_utf16 or "<table" in header_utf16 or "xmlns:o=" in header_utf16:
                    is_html = True
        except Exception:
            pass
            
        f.write(f"Filename: {filename}\n")
        f.write(f"  Size: {size} bytes\n")
        f.write(f"  Type: {'HTML' if is_html else 'Binary XLS'}\n")
        f.write("-" * 40 + "\n")

print(f"Details written to {log_path}")
