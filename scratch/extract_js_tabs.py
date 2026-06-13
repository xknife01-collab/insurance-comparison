import re

bundle_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\dist\assets\index-Dzh33RV5.js"

with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search for "$t==="planners"" or "$t==="settings""
# Note that we saw "$t==="settings"" and "$t==="billing"" in our previous print
# Let's search for both and dump their compiled blocks!

patterns = [
    r'\$t\s*===\s*["\']planners["\']',
    r'\$t\s*===\s*["\']settings["\']',
    r'\$t\s*===\s*["\']billing["\']'
]

with open("extracted_js_tabs.txt", "w", encoding="utf-8") as out:
    for pat in patterns:
        for match in re.finditer(pat, js):
            idx = match.start()
            # Let's extract 15000 chars after the match to ensure we get the whole tab
            context = js[idx:idx+25000]
            out.write(f"=== MATCH FOR PATTERN {pat} AT INDEX {idx} ===\n")
            out.write(context)
            out.write("\n=============================================\n\n")

print("Extracted JS tabs successfully!")
