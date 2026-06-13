import os

for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if "useB2BBranding" in content:
                print(f"FOUND in {path}")
                # print lines
                lines = content.split("\n")
                for i, line in enumerate(lines):
                    if "useB2BBranding" in line:
                        print(f"  {i+1}: {line}")
