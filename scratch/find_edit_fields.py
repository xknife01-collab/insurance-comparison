file_path = r"src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "editCompanyName" in line:
        print(f"{idx+1}: {line}", end="")
