import subprocess

# Get the file from yesterday's commit
cmd = ["git", "show", "b700aa2:src/components/AnalysisDashboard.tsx"]
result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

content = result.stdout
print("Occurrences of isRemodeling in yesterday's commit:")
lines = content.split('\n')
for idx, line in enumerate(lines):
    if 'isRemodeling' in line:
        print(f"Line {idx+1}: {line.strip()}")
