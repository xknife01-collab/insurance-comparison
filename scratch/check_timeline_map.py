with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "timelineEvents.map" in line:
            print(f"Line {i+1}: {line.strip()}")
            # print surrounding 40 lines
            f.seek(0)
            lines = f.readlines()
            for idx in range(max(0, i - 15), min(len(lines), i + 45)):
                print(f"{idx+1}: {lines[idx]}", end="")
            break
