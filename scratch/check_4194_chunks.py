import re

with open("rc_str_raw.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's find all chunks
# Each chunk has "StartLine": X, "EndLine": Y
matches = re.findall(r'"StartLine":\s*(\d+),\s*"EndLine":\s*(\d+)', text)
print("Chunks in step 4194:")
for i, m in enumerate(matches):
    print(f"Chunk {i}: lines {m[0]}-{m[1]}")
