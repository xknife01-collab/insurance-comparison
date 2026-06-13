import json

log_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\241ca526-f032-47d0-aa8d-addc810bec82\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get("step_index") == 133:
                with open("scratch/extracted_schema_133.txt", "w", encoding="utf-8") as out:
                    out.write(data.get("content", ""))
                print("Successfully wrote schema to scratch/extracted_schema_133.txt")
                break
        except Exception as e:
            pass
