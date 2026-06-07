import subprocess

def run_cmd(cmd):
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    return res.stdout.decode('utf-8', errors='ignore')

# Save the diff of ed4d4b5 to scripts/scratch/commit_diff.diff
diff = run_cmd("git show ed4d4b5 -- src/components/AnalysisDashboard.tsx")
with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\commit_diff.diff", "w", encoding="utf-8") as f:
    f.write(diff)

print("Saved commit diff to scripts/scratch/commit_diff.diff")
