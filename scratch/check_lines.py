path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
out = r"scratch/lines_1063_1072.txt"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()
results = []
for i in range(1062, 1072):
    results.append(f"Line {i+1}: {repr(lines[i])}")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(results))
print("done")
