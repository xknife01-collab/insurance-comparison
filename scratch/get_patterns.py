path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
out = r"scratch/patterns.txt"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

results = []
results.append(f"Line19: {repr(lines[18])}")
for i in range(46, 54):
    results.append(f"Line{i+1}: {repr(lines[i])}")
for i in range(480, 485):
    results.append(f"Line{i+1}: {repr(lines[i])}")
for i in range(868, 873):
    results.append(f"Line{i+1}: {repr(lines[i])}")

with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(results))
print("done")
