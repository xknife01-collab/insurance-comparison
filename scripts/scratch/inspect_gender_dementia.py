import re

filepath = "dementia_raw_inspect.txt"

with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Let's find matches and list them
matches = []
# Each block starts with File: and ends with double newline
blocks = text.split("\n\n")

for block in blocks:
    if not block.strip():
        continue
    # Check if block contains any gender words
    # But wait, we want to exclude things like '남' inside '남았을', '여' inside '이후에', etc.
    # So let's look for '남', '여', '남자', '여자', '남성', '여성' followed or preceded by numbers/원/comma or space.
    if re.search(r'(남|여|남자|여자|남성|여성)\s*\d', block) or re.search(r'\d\s*(남|여|남자|여자|남성|여성)', block) or "남자" in block or "여자" in block or "남성" in block or "여성" in block:
        matches.append(block)

print(f"Found {len(matches)} blocks containing gender premium details.")
for m in matches[:20]:
    print(m)
    print("-" * 40)
