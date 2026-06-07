import re

filepath = "src/components/AnalysisDashboard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("\r\n", "\n")

# Fix Diet card h4: mb-1 -> mb-4, remove group-hover:text-blue-600, remove "transition-colors uppercase"
# Current:
old_diet_h4 = '              <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase">{result.recommendations.diet.title}</h4>'
# Target (matches commit_diff + grand design):
new_diet_h4 = '              <h4 className="text-2xl font-black mb-4 tracking-tighter text-blue-900 relative z-10">{result.recommendations.diet.title}</h4>'

if old_diet_h4 in content:
    content = content.replace(old_diet_h4, new_diet_h4)
    print("SUCCESS: diet h4 fixed")
else:
    print("WARNING: diet h4 not found, trying alternate...")
    # Try without checking
    pattern = r'<h4 className="text-2xl font-black mb-\d tracking-tighter text-blue-900[^"]*">\{result\.recommendations\.diet\.title\}</h4>'
    match = re.search(pattern, content)
    if match:
        content = content[:match.start()] + new_diet_h4 + content[match.end():]
        print("SUCCESS: diet h4 fixed via regex")
    else:
        print("FAIL: diet h4 not found")

# Fix Upgrade card h4: mb-1 -> mb-4, remove "uppercase"
old_upgrade_h4 = '               <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>'
new_upgrade_h4 = '               <h4 className="text-2xl font-black mb-4 tracking-tighter text-orange-400">{result.recommendations.upgrade.title}</h4>'

if old_upgrade_h4 in content:
    content = content.replace(old_upgrade_h4, new_upgrade_h4)
    print("SUCCESS: upgrade h4 fixed")
else:
    pattern = r'<h4 className="text-2xl font-black mb-\d tracking-tighter text-orange-400[^"]*">\{result\.recommendations\.upgrade\.title\}</h4>'
    match = re.search(pattern, content)
    if match:
        content = content[:match.start()] + new_upgrade_h4 + content[match.end():]
        print("SUCCESS: upgrade h4 fixed via regex")
    else:
        print("FAIL: upgrade h4 not found")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done.")
