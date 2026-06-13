import os
for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "URLSearchParams" in content:
                    print(f"File: {path}")
                    for line in content.splitlines():
                        if "planner" in line or "agency" in line or "get(" in line:
                            print(f"  Line: {line.strip()}")
