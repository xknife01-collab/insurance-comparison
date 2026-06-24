import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\insurance\remodeling\PerPolicyDashboard.tsx"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    repl_count = content.count("\ufffd")
    print(f"Number of \\ufffd in working copy: {repl_count}")
else:
    print("File not found")
