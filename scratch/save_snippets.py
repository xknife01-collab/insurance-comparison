bundle_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\dist\assets\index-Dzh33RV5.js"

with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's save index 2282749 (planners) and index 2284586 (settings) to files
with open("planners_js.txt", "w", encoding="utf-8") as f:
    f.write(js[2282749:2282749+25000])

with open("settings_js.txt", "w", encoding="utf-8") as f:
    f.write(js[2284586:2284586+25000])

print("Saved JS snippets to files")
