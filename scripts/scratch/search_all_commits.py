import subprocess

cmd = ["git", "log", "-G", "가격은 낮추고", "--oneline"]
res = subprocess.run(cmd, capture_output=True, text=True, errors='ignore')
print("Commits modifying the line containing '가격은 낮추고':")
print(res.stdout)

# Let's print the diffs for those commits
for line in res.stdout.strip().split('\n'):
    if line:
        commit = line.split()[0]
        print(f"\n================ DIFF FOR {line} ================")
        diff_cmd = ["git", "show", commit, "--", "src/components/AnalysisDashboard.tsx"]
        diff_res = subprocess.run(diff_cmd, capture_output=True, text=True, errors='ignore')
        print(diff_res.stdout[:2000]) # Print first 2000 chars
