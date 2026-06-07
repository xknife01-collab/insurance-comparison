import os

path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\restored_code.tsx"
if not os.path.exists(path):
    path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_2132_code_formatted.tsx"

if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"Total lines: {len(content.splitlines())}")
    # Print in blocks of 100 lines
    lines = content.splitlines()
    for i in range(0, len(lines), 150):
        print(f"--- Block {i} to {i+150} ---")
        print("\n".join(lines[i:i+150]))
else:
    print("Backup file not found.")
