import subprocess

def run_cmd(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    return res.stdout.decode('utf-8', errors='ignore')

commits = run_cmd("git log --format=%H -n 15").splitlines()

for commit in commits:
    subject = run_cmd(f"git log -1 --format='%h : %s' {commit}").strip()
    content = run_cmd(f"git show {commit}:src/components/AnalysisDashboard.tsx")
    if not content:
        continue
    
    # Check for the comparison table within the upgrade card
    if "allUpgradeOptions" in content:
        lines = content.splitlines()
        found = False
        for idx, line in enumerate(lines):
            if "allUpgradeOptions" in line and "map" in line:
                print(f"Commit {subject} at line {idx}:")
                # print 25 lines
                for l in lines[idx:idx+25]:
                    print("  ", l)
                found = True
        if found:
            print("=" * 60)
