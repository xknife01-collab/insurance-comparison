import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    
    repl_count = content.count("\ufffd")
    print(f"Number of \\ufffd characters in AnalysisSection.tsx: {repl_count}")
    if repl_count > 0:
        # Find lines with \ufffd
        lines = content.splitlines()
        for idx, line in enumerate(lines):
            if "\ufffd" in line:
                print(f"Line {idx+1}: {repr(line)}")
else:
    print("File not found")
