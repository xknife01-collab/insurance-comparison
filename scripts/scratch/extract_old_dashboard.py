import subprocess

# Extract AnalysisDashboard.tsx from commit b700aa2
cmd = ["git", "show", "b700aa2:src/components/AnalysisDashboard.tsx"]
result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

# Let's search for "Optimized Protection Strategies" or "recommendations" in the old code
lines = result.stdout.split('\n')
start_line = -1
end_line = -1

for idx, line in enumerate(lines):
    if "Optimized Protection Strategies" in line or "나에게 맞는 추천 시나리오" in line:
        start_line = idx - 5
    if start_line != -1 and "Full Market Analysis Section" in line:
        end_line = idx + 20
        break

if start_line != -1 and end_line != -1:
    extracted = "\n".join(lines[start_line:end_line])
    with open(r'scripts\scratch\old_dashboard_cards.tsx', 'w', encoding='utf-8') as f:
        f.write(extracted)
    print(f"Successfully extracted lines {start_line} to {end_line} of old dashboard to scripts\\scratch\\old_dashboard_cards.tsx")
else:
    print("Could not find the recommendations section in the old commit.")
    # Let's write the whole file so we can search it
    with open(r'scripts\scratch\old_dashboard_whole.tsx', 'w', encoding='utf-8') as f:
        f.write(result.stdout)
    print("Wrote whole old file to scripts\\scratch\\old_dashboard_whole.tsx")
