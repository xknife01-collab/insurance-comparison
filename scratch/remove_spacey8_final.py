import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Before: {len(lines)} lines')
print(f'Deleting index 765: {repr(lines[765][:60])}')
print(f'Deleting index 686: {repr(lines[686][:60])}')

# Delete higher index first to avoid offset issues
del lines[765]  # space-y-8 closing </div>
del lines[686]  # space-y-8 opening <div>

print(f'After: {len(lines)} lines')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()

print('\nVerification lines 684~692:')
for i in range(683, 692):
    print(f'{i+1}: {repr(verify[i][:100])}')
print('...')
print('Verification lines 760~768:')
for i in range(759, 768):
    print(f'{i+1}: {repr(verify[i][:100])}')
