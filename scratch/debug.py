import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find Hybrid Type comment
idx = content.find('{/* Hybrid Type */')
print(repr(content[idx:idx+300]))
