file_path = r"src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx in range(2479, 2510):
    print(f"{idx+1}: {lines[idx]}", end="")
