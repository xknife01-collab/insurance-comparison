with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

# lines is 0-indexed, so line 2473 is index 2472
target = "".join(lines[2472:3007])

with open("precise_target.txt", "w", encoding="utf-8") as out:
    out.write(target)

print("precise_target.txt written, len:", len(target))
