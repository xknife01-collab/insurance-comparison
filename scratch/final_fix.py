import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total: {len(lines)} lines')
print(f'idx 686: {repr(lines[686][:80])}')  # {isRemodeling ? (
print(f'idx 687: {repr(lines[687][:80])}')  # <div class="absolute..."  <- should be inside card
print(f'idx 688: {repr(lines[688][:80])}')  # <Zap...
print(f'idx 689: {repr(lines[689][:80])}')  # <div class="bg-gradient..." <- card opener, wrong pos

# Move line at index 689 to index 687 (before absolute div)
card_open_line = lines.pop(689)
print(f'\nMoving: {repr(card_open_line[:80])}')
lines.insert(687, card_open_line)

print(f'\nAfter move:')
for i in range(685, 695):
    print(f'{i+1}: {repr(lines[i][:110])}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'\nDone! Total: {len(lines)} lines')
