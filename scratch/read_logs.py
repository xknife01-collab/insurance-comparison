import os
import json
import sys
from datetime import datetime, timedelta

# Force utf-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
conv_ids = [
    "5c4c8685-fa4b-4f29-9fe0-0743fbd812ac",
    "c8221749-af1b-4005-8372-33b290c7a75c",
    "ba69e794-8393-470c-aeaa-9458f4e035c4",
    "7ce7754a-1628-4c1d-a630-f93701336ae5"
]

target_time_utc = datetime(2026, 6, 6, 11, 0, 0) # 20:00 KST is 11:00 UTC

dialogues = []

for cid in conv_ids:
    log_path = os.path.join(brain_dir, cid, ".system_generated", "logs", "overview.txt")
    if not os.path.exists(log_path):
        continue
    
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                created_at_str = data.get("created_at")
                if not created_at_str:
                    continue
                created_at = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ")
                
                # Check if it is after 8 PM KST on June 6th
                if created_at >= target_time_utc:
                    kst_time = created_at + timedelta(hours=9)
                    source = data.get("source")
                    msg_type = data.get("type")
                    content = data.get("content", "")
                    
                    if source == "USER_EXPLICIT" and msg_type == "USER_INPUT":
                        # Clean user request tags if present
                        if "<USER_REQUEST>" in content:
                            content = content.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
                        dialogues.append({
                            "time": kst_time,
                            "role": "USER",
                            "content": content
                        })
                    elif source == "MODEL" and msg_type == "PLANNER_RESPONSE":
                        # Keep text content only (skip raw tool calls description)
                        if content and not content.strip().startswith("I will"):
                            dialogues.append({
                                "time": kst_time,
                                "role": "MODEL",
                                "content": content
                            })
            except Exception as e:
                pass

# Sort by time
dialogues.sort(key=lambda x: x["time"])

for d in dialogues:
    print(f"[{d['time'].strftime('%Y-%m-%d %H:%M:%S')}] {d['role']}:")
    print(d['content'])
    print("-" * 80)
