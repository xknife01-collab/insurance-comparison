import os
import json

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
target_folder = "d56e43ae-f705-4f9f-9c59-511b497f8b25"
log_path = os.path.join(brain_dir, target_folder, ".system_generated", "logs", "overview.txt")

if os.path.exists(log_path):
    with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
        for idx, line in enumerate(f):
            if idx == 974:
                data = json.loads(line)
                tc = data["tool_calls"][0]
                args = tc["args"]
                print("Keys in args:", args.keys())
                for k, v in args.items():
                    if isinstance(v, str):
                        print(f"  {k}: length {len(v)}, starts with {repr(v[:100])}")
                    else:
                        print(f"  {k}: {v}")
else:
    print("Log not found")
