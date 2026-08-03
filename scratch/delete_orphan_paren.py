path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

# Line 1067 (index 1066) is an orphan )} - delete it
print(f"Line 1067 content: {repr(lines[1066])}")
del lines[1066]

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"Done. Total lines: {len(lines)}")
for i in range(1063, 1070):
    print(f"  L{i+1}: {repr(lines[i])}")
