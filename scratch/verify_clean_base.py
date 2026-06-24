import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\clean_dashboard_base_40e.tsx"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    repl_count = content.count("\ufffd")
    print(f"Number of \\ufffd: {repl_count}")
    print(f"Total lines: {len(content.splitlines())}")
else:
    print("File not found")
