import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total: {len(lines)}')

# Find the button closing tag for the isRemodeling diet card
# Lines 760-765 region:
for i in range(758, 768):
    print(f'{i+1}: {repr(lines[i][:100])}')
