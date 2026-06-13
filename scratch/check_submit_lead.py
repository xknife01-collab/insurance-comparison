with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const submitLead" in line or "function submitLead" in line:
        start = max(0, i - 2)
        end = min(len(lines), i + 60)
        for idx in range(start, end):
            print(f"Line {idx+1}: {lines[idx]}", end="")
