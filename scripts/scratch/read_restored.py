import json
import os

f_in = r'C:\Users\zkfnt\.gemini\antigravity\brain\35d5563e-d761-444d-b84b-b3116fef5b56\restored_2132_code_formatted.tsx'
f_out = r'scripts\scratch\restored_code.tsx'

with open(f_in, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's clean the string if it is double quoted JSON string
if content.startswith('"') and content.endswith('"'):
    try:
        decoded = json.loads(content)
    except Exception as e:
        # If it fails to parse as JSON because of some bad escapes, let's do a basic eval or print
        print("JSON decode failed:", e)
        decoded = content
else:
    # Let's try to json load it anyway if it is wrapped in quotes
    try:
        # Add wrapping quotes if not present but needed
        if not content.startswith('"'):
            content_json = '"' + content + '"'
        else:
            content_json = content
        decoded = json.loads(content_json)
    except Exception as e:
        # Fallback
        # If it has escaped newlines like \n, let's replace them
        decoded = content.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')

os.makedirs(os.path.dirname(f_out), exist_ok=True)
with open(f_out, 'w', encoding='utf-8') as f:
    f.write(decoded)

print("Decoded restored code written successfully to", f_out)
