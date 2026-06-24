path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
out = r"scratch/last_corruption.txt"
U = chr(0xfffd)
with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()
results = []
for i, line in enumerate(lines):
    if U in line:
        results.append(f"Line {i+1}: {repr(line)}")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(results))
print(f"Found {len(results)} lines with corruption. Written to {out}")
