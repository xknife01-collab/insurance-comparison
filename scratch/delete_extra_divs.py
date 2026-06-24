path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

# Line 1067 and 1068 (index 1066, 1067) are extra </div> tags - delete them
del lines[1066]  # removes line 1067
del lines[1066]  # removes what was line 1068 (now at index 1066)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"Done. Total lines: {len(lines)}")
print("Lines around fix area:")
for i in range(1063, 1070):
    print(f"  L{i+1}: {repr(lines[i])}")
