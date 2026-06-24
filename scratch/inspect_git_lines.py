import subprocess

cmd = "git show HEAD:src/components/AnalysisSection.tsx"
res = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding="utf-8", errors="ignore")

lines = res.stdout.splitlines()
print(f"Total lines in git HEAD: {len(lines)}")
if len(lines) >= 1143:
    print(f"Line 1143: {lines[1142]}")
    print(f"Line 1144: {lines[1143]}")
