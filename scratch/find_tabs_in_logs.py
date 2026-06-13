import json

log_path = r"C:\Users\zkfnt\.gemini\antigravity\brain\241ca526-f032-47d0-aa8d-addc810bec82\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if "activeTab === 'planners'" in line or "activeTab === 'settings'" in line:
            print(f"Line {i+1}: {line[:200]}")
