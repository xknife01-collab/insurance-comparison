import os

dashboard_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    content = f.read()

# We want to replace starting from line 2473 (0-indexed 2472)
# Let's read lines
with open(dashboard_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

print("Line 2471 (index 2470):", repr(lines[2470]))
print("Line 2472 (index 2471):", repr(lines[2471]))
print("Line 2473 (index 2472):", repr(lines[2472]))
print("Line 2474 (index 2473):", repr(lines[2473]))
print("Line 2475 (index 2474):", repr(lines[2474]))

# Find the end marker: {/* Tab 6: Marketing & Campaign Analytics */}
end_marker = "              {/* Tab 6: Marketing & Campaign Analytics */}"
end_idx = content.find(end_marker)
if end_idx == -1:
    print("Error: end marker not found!")
else:
    print("Found end marker at index:", end_idx)
    # Let's find the line index for end_marker
    for i, line in enumerate(lines):
        if end_marker in line:
            print(f"End marker is at line {i+1} (index {i}): {repr(line)}")
            break
