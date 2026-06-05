import re

matches_file = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\travel_robust_matches.txt"

with open(matches_file, "r", encoding="utf-8") as f:
    content = f.read()

# Find matches blocks
blocks = re.split(r'\n(?=\[[^\]]+\] - Found)', content)

for block in blocks:
    header_match = re.match(r'\[([^\]]+)\] - Found (\d+) matches', block)
    if header_match:
        filename = header_match.group(1)
        # Search block for "여행" or "해외" or "국내" in lines
        lines = block.split('\n')
        relevant_lines = []
        for line in lines:
            if "여행" in line or "해외" in line or "국내" in line or "유학" in line:
                # exclude common fund names like "국내채권", "해외주식", "반려동물", "반려견"
                if not any(x in line for x in ["채권", "주식", "반려", "치과", "골프"]):
                    relevant_lines.append(line)
        if relevant_lines:
            print(f"File: {filename} - {len(relevant_lines)} relevant matches")
            for rl in relevant_lines[:5]:
                print(f"  {rl[:150]}")
