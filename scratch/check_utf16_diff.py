import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\diff_perpolicy.txt"

if os.path.exists(file_path):
    print("Checking encoding...")
    # Try reading as UTF-16
    try:
        with open(file_path, "r", encoding="utf-16") as f:
            content = f.read()
        repl_count = content.count("\ufffd")
        print(f"Decoded as UTF-16: {repl_count} replacement characters. File length: {len(content)}")
        
        # Print a small part of the file to see if it contains Korean
        lines = content.splitlines()
        for idx in range(min(50, len(lines))):
            line = lines[idx]
            if "detectType" in line or "COMPANIES" in line or "CovRow" in line:
                print(f"Line {idx+1}: {line}")
    except Exception as e:
        print("UTF-16 decode failed:", e)
else:
    print("File not found")
