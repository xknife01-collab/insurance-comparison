with open("bundle_matches.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for "소속 설계사 관리" in the file
import re
matches = [m.start() for m in re.finditer("소속 설계사 관리", content)]
print(f"Matches for '소속 설계사 관리': {len(matches)} at indices {matches}")

for m in matches:
    print(content[m:m+1000])
    print("====================")
