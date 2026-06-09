# -*- coding: utf-8 -*-
import sys, json, datetime, os
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(WORKSPACE, "src", "lib", "insurance", "disclosure_dates.json")

def update(category: str):
    now = datetime.datetime.now()
    label = f"{now.year}년 {now.month:02d}월 공시"
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data[category] = label
    data["updated_at"] = now.strftime("%Y-%m-%d")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[+] {category} => {label}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_disclosure_date.py <category>")
        sys.exit(1)
    update(sys.argv[1])
