import os

diff_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\diff_perpolicy_utf8.txt"

if os.path.exists(diff_path):
    print("Reading diff...")
    with open(diff_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    print(f"Total lines: {len(lines)}")
    
    # Print lines that look like hunk headers or specific changes
    hunks = 0
    for idx, line in enumerate(lines):
        if line.startswith("@@"):
            hunks += 1
            print(f"\nHunk {hunks} at line {idx}: {line.strip()}")
            # Print next 15 lines of the hunk
            for j in range(1, 20):
                if idx + j < len(lines):
                    print(f"  {lines[idx+j]}", end="")
else:
    print("Diff file not found")
