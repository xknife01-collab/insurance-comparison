import re

path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"
with open(path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

ufffd_count = content.count(chr(0xfffd))
lines = len(content.splitlines())

# Check for ? adjacent to Korean chars (suspicious corruption)
suspicious = []
for m in re.finditer(r"[가-힣]\?|\?[가-힣]", content):
    line_num = content[:m.start()].count('\n') + 1
    ctx = content[max(0,m.start()-20):m.end()+20].replace('\n','')
    suspicious.append(f"  L{line_num}: ...{ctx}...")

with open("scratch/file_check_result.txt", "w", encoding="utf-8") as f:
    f.write(f"Lines: {lines}\n")
    f.write(f"Corrupted chars (\\ufffd): {ufffd_count}\n")
    f.write(f"Suspicious ? near Korean: {len(suspicious)}\n")
    for s in suspicious[:20]:
        f.write(s + "\n")
    f.write("\nStatus: CLEAN\n" if ufffd_count == 0 and len(suspicious) == 0 else "\nStatus: NEEDS REVIEW\n")

print("Check complete. Written to scratch/file_check_result.txt")
