import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Before: {len(lines)} lines')
print(f'Line 687 (1-idx): {repr(lines[686][:80])}')
print(f'Line 765 (1-idx): {repr(lines[764][:80])}')

# Insert closing div at index 764 (before motion.div line) - do higher index first
lines.insert(764, '             </div>\n')

# Insert opening card div at index 687 (after '{isRemodeling ? (')
lines.insert(687, '             <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col overflow-hidden relative">\n')

print(f'After: {len(lines)} lines')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()

print('\nVerification lines 685~692:')
for i in range(684, 692):
    print(f'{i+1}: {repr(verify[i][:120])}')
print('...')
print('Verification lines 764~772:')
for i in range(763, 772):
    print(f'{i+1}: {repr(verify[i][:100])}')
