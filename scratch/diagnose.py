with open('src/components/AnalysisDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

total = len(lines)
print(f'Total lines: {total}')

# Find key line numbers
for i, l in enumerate(lines):
    stripped = l.strip()
    if 'Whole Market' in stripped and 'Section' in stripped:
        print(f'WMC comment: {i+1}')
    if 'space-y-16 pb-32' in stripped:
        print(f'WMC section tag: {i+1}')
    if 'Upgrade Type' in stripped and 'Main' in stripped:
        print(f'Upgrade card start: {i+1}')
    if 'Diet Type' in stripped:
        print(f'Diet card start: {i+1}')
    if 'isRemodeling' in stripped and 'const isRemodeling' in stripped:
        print(f'isRemodeling defined: {i+1}')
