import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Before: {len(lines)} lines')
print(f'Line 688 (1-idx): {repr(lines[687][:80])}')
print(f'Line 768 (1-idx): {repr(lines[767][:80])}')

# 라인 688 (0-idx 687): '<div className="space-y-8">' 제거
# 라인 768 (0-idx 767): '             </div>' 제거
# 높은 index부터 삭제 (낮은 index가 밀리지 않도록)
del lines[767]  # space-y-8 닫는 </div>
del lines[687]  # space-y-8 여는 <div>

print(f'After: {len(lines)} lines')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()
print('Verification lines 685~692:')
for i in range(684, 692):
    print(f'{i+1}: {repr(verify[i][:100])}')
print('...')
print('Verification lines 762~770:')
for i in range(761, 770):
    print(f'{i+1}: {repr(verify[i][:100])}')
