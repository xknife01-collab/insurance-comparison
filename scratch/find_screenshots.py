import os

search_paths = [
    r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main",
    r"C:\Users\zkfnt\.gemini\antigravity\brain\76bb4717-0846-4b03-82d1-9ccebf163c89"
]

found = []
for path in search_paths:
    if os.path.exists(path):
        for root, dirs, files in os.walk(path):
            for file in files:
                if "final" in file.lower() or "cards" in file.lower() or "table" in file.lower():
                    if "node_modules" not in root and ".git" not in root:
                        found.append(os.path.join(root, file))

print(f"Total matching files: {len(found)}")
for item in found:
    print(item)
