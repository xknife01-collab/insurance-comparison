import os
import json
import sys
from datetime import datetime, timedelta

sys.stdout.reconfigure(encoding='utf-8')

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
conv_ids = [
    "5c4c8685-fa4b-4f29-9fe0-0743fbd812ac",
    "c8221749-af1b-4005-8372-33b290c7a75c",
    "ba69e794-8393-470c-aeaa-9458f4e035c4",
    "7ce7754a-1628-4c1d-a630-f93701336ae5"
]

target_time_utc = datetime(2026, 6, 6, 11, 0, 0)
end_time_utc = datetime(2026, 6, 6, 17, 0, 0)

raw_entries = []
for cid in conv_ids:
    log_path = os.path.join(brain_dir, cid, ".system_generated", "logs", "overview.txt")
    if not os.path.exists(log_path): continue
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line.strip())
                created_at = datetime.strptime(data["created_at"], "%Y-%m-%dT%H:%M:%SZ")
                if target_time_utc <= created_at <= end_time_utc:
                    kst = created_at + timedelta(hours=9)
                    source = data["source"]
                    msg_type = data["type"]
                    content = data.get("content", "")
                    if source == "USER_EXPLICIT" and msg_type == "USER_INPUT":
                        if "<USER_REQUEST>" in content:
                            content = content.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
                        raw_entries.append((kst, "USER", content))
                    elif source == "MODEL" and msg_type == "PLANNER_RESPONSE" and not content.startswith("I will"):
                        raw_entries.append((kst, "MODEL", content))
            except: pass

unique_dialogues = []
last_msg = None
for kst, role, content in sorted(raw_entries, key=lambda x: x[0]):
    if not content.strip(): continue
    if last_msg and last_msg[1] == role and last_msg[2] == content:
        continue
    unique_dialogues.append((kst, role, content))
    last_msg = (kst, role, content)

# Print range 60 to 160
for idx in range(60, min(160, len(unique_dialogues))):
    t, r, c = unique_dialogues[idx]
    
    # Compress long outputs or tables
    if len(c) > 600:
        c = c[:250] + "\n... [중략] ...\n" + c[-250:]
        
    print(f"[{idx+1}] {t.strftime('%H:%M:%S')} | {r}:")
    print(c)
    print("-" * 50)
