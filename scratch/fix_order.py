import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Before: {len(lines)} lines')

# Current state after previous edit:
# index 686: '{isRemodeling ? ('
# index 687: '               <div className="absolute top-0 right-0...'   <- should be inside card
# index 688: '             <div className="bg-gradient..."  <- wrongly inserted here (should be at 687)
# 
# We need to:
# 1. Remove the wrongly placed div at index 688
# 2. Re-insert it at index 687

wrong_line = lines[688]
print(f'Wrong line at index 688: {repr(wrong_line[:80])}')

# Remove it
del lines[688]
# Insert at correct position (index 687, right after '{isRemodeling ? (')
lines.insert(687, wrong_line)

print(f'After: {len(lines)} lines')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()

print('\nVerification lines 685~695:')
for i in range(684, 695):
    print(f'{i+1}: {repr(verify[i][:120])}')
print('...')
print('Verification lines 764~770:')
for i in range(763, 770):
    print(f'{i+1}: {repr(verify[i][:100])}')
