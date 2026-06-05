import re

log_path = r'C:\Users\zkfnt\.gemini\antigravity\brain\721cffe7-a347-47d5-870d-5a050dc12941\.system_generated\logs\overview.txt'
with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Let's search for JSON payloads containing 'car' or selectedCategory 'car' or age
payloads = re.findall(r'\{[^{}]*"selectedCategory"[^{}]*\}', content)
for p in payloads[-5:]:
    print(p)
    print('-'*40)
