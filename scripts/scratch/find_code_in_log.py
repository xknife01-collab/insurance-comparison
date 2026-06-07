import re
import os

file_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_conversation_log.md"
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's find all markdown code blocks
code_blocks = re.findall(r"```(tsx|typescript|javascript|html|css)?\n(.*?)\n```", content, re.DOTALL)
print(f"Found {len(code_blocks)} code blocks.")

scratch_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch"
os.makedirs(scratch_dir, exist_ok=True)

for idx, (lang, block) in enumerate(code_blocks):
    out_path = os.path.join(scratch_dir, f"block_{idx+1}.txt")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(block)
    
    first_lines = block.strip().split('\n')[:5]
    print(f"Block {idx+1} ({lang or 'text'}): written to block_{idx+1}.txt ({len(block.splitlines())} lines)")
    safe_lines = [line.encode('ascii', errors='replace').decode('ascii') for line in first_lines]
    print("\n".join(safe_lines))
    print("-" * 30)
