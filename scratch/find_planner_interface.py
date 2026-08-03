file_path = r"src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "interface Planner" in line:
        print(f"Planner interface start at line: {idx+1}")
        for j in range(idx, idx+30):
            print(f"{j+1}: {lines[j]}", end="")
        break
