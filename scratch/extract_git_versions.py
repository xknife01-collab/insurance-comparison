import subprocess
import os

file_path = "src/components/insurance/remodeling/PerPolicyDashboard.tsx"

# Let's get the list of commits that touched this file
cmd = ["git", "log", "--follow", "--format=%H %cd %s", "--", file_path]
result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
log_output = result.stdout.decode('utf-8', errors='ignore')
print("Commits touching the file:")
print(log_output)

commits = [line.split()[0] for line in log_output.splitlines() if line]

# For each commit, let's show the file contents as raw bytes and check encodings
for commit in commits[:5]: # Check the latest 5 commits
    print(f"\nChecking commit: {commit}")
    cmd_show = ["git", "show", f"{commit}:{file_path}"]
    res_show = subprocess.run(cmd_show, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    raw_bytes = res_show.stdout
    
    if len(raw_bytes) == 0:
        print("  Empty file or error")
        continue
        
    print(f"  Raw size: {len(raw_bytes)} bytes")
    
    # Try decoding
    decodings = ['utf-8', 'cp949', 'utf-16le', 'utf-16']
    for dec in decodings:
        try:
            content = raw_bytes.decode(dec)
            repl = content.count("\ufffd")
            question_marks = content.count("?")
            # Let's find some Korean strings or count Korean chars to see if they decode correctly
            korean_chars = sum(1 for c in content if 0xAC00 <= ord(c) <= 0xD7A3)
            print(f"    Decoded with {dec}: {repl} replacement chars, {question_marks} question marks, {korean_chars} Korean characters.")
            if repl == 0 and question_marks < 20 and korean_chars > 100:
                print("      -> POSSIBLY CLEAN VERSION! Saving to scratch...")
                out_name = f"scratch/clean_from_{commit[:7]}_{dec}.tsx"
                with open(out_name, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"      -> Saved to {out_name}")
        except Exception as e:
            print(f"    Failed with {dec}: {e}")
