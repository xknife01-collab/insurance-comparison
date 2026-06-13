import os
import re

for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".jsx")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "planner=" in content or "agency=" in content:
                    print(f"File: {path}")
                    for m in re.finditer(r"(planner|agency)=", content):
                        start = max(0, m.start() - 40)
                        end = min(len(content), m.end() + 40)
                        print(f"  Snippet: {content[start:end].strip()}")
