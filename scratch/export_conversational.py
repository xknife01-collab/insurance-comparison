import os
import json
from datetime import datetime, timedelta

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
conv_ids = [
    "5c4c8685-fa4b-4f29-9fe0-0743fbd812ac",
    "c8221749-af1b-4005-8372-33b290c7a75c",
    "ba69e794-8393-470c-aeaa-9458f4e035c4",
    "7ce7754a-1628-4c1d-a630-f93701336ae5"
]

target_time_utc = datetime(2026, 6, 6, 11, 0, 0)
end_time_utc = datetime(2026, 6, 6, 17, 0, 0)

all_events = []
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
                    all_events.append({
                        "time": kst,
                        "source": source,
                        "type": msg_type,
                        "content": content
                    })
            except: pass

all_events.sort(key=lambda x: x["time"])

filtered_dialogue = []
temp_model_msg = None

for ev in all_events:
    if ev["source"] == "USER_EXPLICIT" and ev["type"] == "USER_INPUT":
        if temp_model_msg:
            filtered_dialogue.append(temp_model_msg)
            temp_model_msg = None
        
        content = ev["content"]
        if "<USER_REQUEST>" in content:
            content = content.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
        filtered_dialogue.append({"time": ev["time"], "role": "USER", "content": content})
    elif ev["source"] == "MODEL" and ev["type"] == "PLANNER_RESPONSE":
        content = ev["content"]
        if content and not content.strip().startswith("I will"):
            temp_model_msg = {"time": ev["time"], "role": "MODEL", "content": content}

if temp_model_msg:
    filtered_dialogue.append(temp_model_msg)

output_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\conversational_history.md"

with open(output_path, "w", encoding="utf-8") as f:
    f.write("# 💬 6월 6일 저녁 8시 이후 실제 대화 내역 (대화만 정리)\n\n")
    f.write(f"시스템 로그와 도구 실행 과정 등을 제외하고, 실제 나누었던 사용자 질문과 모델 답변만 시간순으로 정렬한 문서입니다. (총 {len(filtered_dialogue)}건)\n\n---\n\n")
    
    for idx, d in enumerate(filtered_dialogue):
        f.write(f"## [{idx+1}] {d['time'].strftime('%Y-%m-%d %H:%M:%S')} | **{d['role']}**\n\n")
        f.write(f"{d['content']}\n\n")
        f.write("\n---\n\n")

print(f"SUCCESS: Wrote {len(filtered_dialogue)} messages to scratch/conversational_history.md")
