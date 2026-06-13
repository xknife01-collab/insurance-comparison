with open("extracted_js_tabs.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    if "=== MATCH FOR PATTERN" in line:
        print(line.strip())
