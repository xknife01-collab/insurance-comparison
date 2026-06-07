import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact diet block by locating its start and end
start_marker = '           {/* Diet Type */}\n           <motion.div'
end_marker = '           </motion.div>\n\n           {/* Upgrade Type'

start_idx = content.find(start_marker)
end_search_from = start_idx + len(start_marker)
end_idx = content.find(end_marker, end_search_from)

if start_idx == -1:
    print('ERROR: start_marker not found')
elif end_idx == -1:
    print('ERROR: end_marker not found')
    # Try to find alternate end
    alt_end = content.find('</motion.div>', end_search_from)
    print(f'First </motion.div> after start: at {alt_end}')
    print(repr(content[alt_end:alt_end+100]))
else:
    end_full = end_idx + len('           </motion.div>')
    old_block = content[start_idx:end_full]
    print(f'Found block from {start_idx} to {end_full}')
    print(f'Block length: {len(old_block)} chars')
    print('First 200 chars:')
    print(repr(old_block[:200]))
    print('Last 100 chars:')
    print(repr(old_block[-100:]))
