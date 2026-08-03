import subprocess
import os

commit = "ca82d85"
file_path = "src/components/insurance/remodeling/PerPolicyDashboard.tsx"

cmd = f"git show {commit}:{file_path}"
res = subprocess.run(cmd, shell=True, capture_output=True)
content = res.stdout.decode("utf-8")

lines = content.splitlines()
print(f"Total lines: {len(lines)}")

# Find lines containing PolicyCard or detectType
for idx, line in enumerate(lines):
    if "function detectType" in line or "const PolicyCard" in line or "function PolicyCard" in line:
        print(f"Line {idx+1}: {line}")
