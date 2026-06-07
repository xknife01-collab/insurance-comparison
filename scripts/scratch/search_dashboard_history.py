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
    
    # Let's check if there are cards inside
    if "Optimized Protection Strategies" in content or "나에게 맞는 추천 시나리오" in content:
        print(f"Commit {subject} has recommendations. Checking layout...")
        # Find the line indices or occurrences
        lines = content.splitlines()
        found_idx = -1
        for idx, line in enumerate(lines):
            if "나에게 맞는 추천 시나리오" in line:
                found_idx = idx
                break
        if found_idx != -1:
            print(f"  Found at line {found_idx}. Excerpt:")
            for l in lines[found_idx:found_idx+40]:
                print("    ", l)
            print("-" * 50)
