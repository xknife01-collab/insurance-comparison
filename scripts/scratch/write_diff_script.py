import subprocess

commit = "943be18900b8f4dcad95cc30dc7259c8a906406c"
cmd = ["git", "show", commit, "--", "src/components/AnalysisDashboard.tsx"]
result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

# Write output to a file so we can view it without truncation/encoding issues
with open(r'scripts\scratch\commit_diff.diff', 'w', encoding='utf-8') as f:
    f.write(result.stdout)

print("Diff written to scripts\\scratch\\commit_diff.diff")
