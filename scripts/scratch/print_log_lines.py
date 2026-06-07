with open(r'C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_conversation_log.md', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for i in range(955, 975):
    safe_line = lines[i].encode('ascii', errors='replace').decode('ascii')
    print(f"{i+1}: {safe_line.strip()}")
