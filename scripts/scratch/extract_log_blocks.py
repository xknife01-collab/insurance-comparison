import re

f_path = r'C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_conversation_log.md'
out_path = r'scripts\scratch\extracted_blocks.txt'

with open(f_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract code blocks
code_blocks = re.findall(r'```(?:tsx|typescript|json|html|css|diff)?\n(.*?)\n```', content, re.DOTALL)

with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.write(f"Found {len(code_blocks)} code blocks.\n")
    for idx, block in enumerate(code_blocks):
        out_f.write(f"\n--- Code Block {idx+1} (Length: {len(block)}) ---\n")
        out_f.write(block)
        out_f.write("\n")

print("Successfully wrote all extracted blocks to", out_path)
