with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

with open("scratch/created_at_renders.txt", "w", encoding="utf-8") as out:
    for i, line in enumerate(lines):
        if "created_at" in line or "created" in line:
            start = max(0, i - 5)
            end = min(len(lines), i + 10)
            out.write(f"--- MATCH AT LINE {i+1} ---\n")
            for idx in range(start, end):
                out.write(f"{idx+1}: {lines[idx]}")
