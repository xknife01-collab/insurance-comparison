import subprocess
import sys

def run_cmd(cmd):
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        return res.stdout.decode('utf-8', errors='ignore')
    except Exception as e:
        return ""

commits = run_cmd("git log --format=%H -n 50").splitlines()
print(f"Found {len(commits)} commits to check.")

for commit in commits:
    diff = run_cmd(f"git show {commit} -- src/components/AnalysisDashboard.tsx")
    if "selectedPlan" in diff or "setSelectedPlan" in diff:
        subject = run_cmd(f"git log -1 --format=%s {commit}").strip()
        print(f"Commit {commit[:7]} ({subject}) matches:")
        for line in diff.splitlines():
            if "selectedPlan" in line or "setSelectedPlan" in line:
                print("  ", line.strip())
