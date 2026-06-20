file_path = r"src/components/Sections.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "customAddress" in line or "certification" in line:
        print(f"Line {idx+1}: {line}", end="")
        # print 5 lines before and after
        start = max(0, idx - 5)
        end = min(len(lines), idx + 6)
        print("--- CONTEXT ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------\n")
