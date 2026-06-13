import re

bundle_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\dist\assets\index-Dzh33RV5.js"

with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search for some patterns
patterns = [
    r'(\w+)\s*=\s*async\s*\(\w*\)\s*=>\s*\{\s*const\s+\w+\s*=\s*await\s+\w+\.from\(\"planners\"',
    r'from\(\"planners\"\)',
    r'from\(\"agencies\"\)',
    r'update_agency_credits',
    r'routing_type',
    r'setRoutingType',
    r'logo_url',
    r'address',
    r'phone'
]

for pat in patterns:
    matches = [m.start() for m in re.finditer(pat, js)]
    print(f"Pattern: {pat}, matches: {len(matches)} at {matches[:5]}")
