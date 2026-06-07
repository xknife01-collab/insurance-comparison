import subprocess

def run_cmd(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    return res.stdout.decode('utf-8', errors='ignore')

commits = ["afe33bd", "5825308", "3ebc7ce", "ee04dc8", "41e7ae4"]

with open("scripts/scratch/git_diffs.txt", "w", encoding="utf-8") as out:
    for c in commits:
        out.write(f"=== DIFF WITH {c} ===\n")
        diff = run_cmd(f"git diff {c} -- src/components/AnalysisDashboard.tsx")
        out.write(diff)
        out.write("\n" + "=" * 60 + "\n")

print("Diffs written to scripts/scratch/git_diffs.txt successfully.")
