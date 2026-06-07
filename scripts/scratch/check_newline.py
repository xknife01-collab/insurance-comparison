import re

with open(r'scripts\scratch\restored_code.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

print("Total length:", len(content))
print("Number of actual newlines:", content.count('\n'))
print("Number of literal \\n:", content.count('\\n'))

# If it has literal \\n, let's replace them with real newlines
if content.count('\\n') > 0 and content.count('\n') < 10:
    content = content.replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
    with open(r'scripts\scratch\restored_code_formatted.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Formatted file written to restored_code_formatted.tsx!")
else:
    # Just print the first 500 characters
    print("Start:", content[:500])
