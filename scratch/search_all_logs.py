import json

log_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\241ca526-f032-47d0-aa8d-addc810bec82\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line in enumerate(f, 1):
        try:
            data = json.loads(line)
            content = data.get("content", "").lower()
            if "policy" in content or "security" in content or "rls" in content:
                print(f"--- MATCH AT LINE {line_num} (step_index: {data.get('step_index')}) ---")
                print(data.get("content")[:1000])
                print("...\n")
        except Exception as e:
            pass
