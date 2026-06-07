import re
import json
import os

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\restored_conversation.md"
if not os.path.exists(file_path):
    file_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_conversation_log.md"

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's find tool calls. They look like: [Tool Calls]: [{"name": ..., "args": ...}]
tool_calls_matches = re.finditer(r"\[Tool Calls\]:\s*(\[.*?\])", content, re.DOTALL)

scratch_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\extracted_tool_calls"
os.makedirs(scratch_dir, exist_ok=True)

count = 0
for match in tool_calls_matches:
    json_str = match.group(1)
    try:
        # Clean up some common markdown/text patterns in json_str if needed
        # But let's try raw parsing first
        calls = json.loads(json_str)
        for call in calls:
            name = call.get('name')
            args = call.get('args', {})
            target_file = args.get('TargetFile', '')
            if 'AnalysisDashboard' in target_file or 'AnalysisDashboard' in str(args):
                count += 1
                out_path = os.path.join(scratch_dir, f"call_{count}_{name}.json")
                with open(out_path, 'w', encoding='utf-8') as out_f:
                    json.dump(call, out_f, indent=2, ensure_ascii=False)
                print(f"Extracted call {count} ({name}) targeting AnalysisDashboard to {os.path.basename(out_path)}")
    except Exception as e:
        # If standard json parsing fails, try regex to find TargetFile and ReplacementContent
        pass

print(f"Total extracted: {count}")
