with open("bundle_matches.txt", "r", encoding="utf-8") as f:
    text = f.read()

# Let's split by the separator
parts = text.split("---------------------------------")
print(f"Total parts: {len(parts)}")
for idx, part in enumerate(parts):
    print(f"--- PART {idx} ---")
    print(part[:300]) # Print first 300 chars of each part
    print(f"... (total {len(part)} chars)")
