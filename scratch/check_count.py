path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()
lines = content.split('\n')
print(f"Total ufffd: {content.count(chr(0xfffd))}")
# Check line 19 area
for i in [18,19,20]:
    print(f"L{i+1}: {repr(lines[i][:80])}")
