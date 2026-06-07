import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total: {len(lines)} lines')

# Print lines 683-775 to see current state
for i in range(682, 775):
    print(f'{i+1}: {repr(lines[i][:110])}')
