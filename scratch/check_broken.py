with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "타임라인 로그 리스트" in line:
        start = max(0, i - 15)
        end = min(len(lines), i + 70)
        with open("scratch/broken_output.txt", "w", encoding="utf-8") as out:
            for idx in range(start, end):
                out.write(f"Line {idx+1}: {lines[idx]}")
