import subprocess

cmd = ["git", "log", "-S", "isRemodeling", "--oneline"]
res = subprocess.run(cmd, capture_output=True, text=True, errors='ignore')
print("Commits modifying 'isRemodeling':")
print(res.stdout)

# Let's show the diff for these commits if any
for line in res.stdout.strip().split('\n'):
    if line:
        commit = line.split()[0]
        print(f"\n================ DIFF FOR {line} ================")
        diff_cmd = ["git", "show", commit, "--", "src/components/AnalysisDashboard.tsx"]
        diff_res = subprocess.run(diff_cmd, capture_output=True, text=True, errors='ignore')
        print(diff_res.stdout[:2000]) # First 2000 chars
