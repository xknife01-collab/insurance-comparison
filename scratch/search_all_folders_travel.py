import os

root_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main"
keywords = ["여행", "travel", "해외", "국내"]

found = []
for root, dirs, files in os.walk(root_dir):
    # Skip .git, node_modules, etc.
    if any(p in root for p in [".git", "node_modules", ".next", "dist", ".gemini"]):
        continue
    for file in files:
        if any(kw in file for kw in keywords):
            found.append(os.path.join(root, file))

print(f"Found {len(found)} files:")
for path in found:
    print(path)
