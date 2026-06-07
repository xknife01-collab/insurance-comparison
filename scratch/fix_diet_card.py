file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Original total lines: {len(lines)}')

# Step 1: Remove coverageChanges ul from outside the card (0-indexed 711~720, 10 lines)
del lines[711:721]

print(f'After deletion: {len(lines)} lines')
print('Lines 745~756 (0-indexed):')
for i, line in enumerate(lines[745:757], start=746):
    print(f'{i}: {repr(line)}')

# After deletion:
# index 747 = '</div>'  (closing the bg-white m-5 table div)
# index 748 = '</div>'  (closing the bg-white m-5 wrapper)
# index 749 = '<div className="px-8 pb-8">'  (button wrapper)
# We insert coverageChanges at index 748 (before px-8 pb-8 button div)

insert_idx = 748

new_lines = [
    '                 <div className="px-8 pt-6">\n',
    '                   <ul className="space-y-3 mb-4">\n',
    '                     {result.recommendations.diet.coverageChanges.map((change, i) => (\n',
    '                       <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">\n',
    '                         <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">\n',
    '                           <ShieldCheck className="w-4 h-4 text-blue-500" />\n',
    '                         </div>\n',
    '                         {change}\n',
    '                       </li>\n',
    '                     ))}\n',
    '                   </ul>\n',
    '                 </div>\n',
]

lines[insert_idx:insert_idx] = new_lines

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'\nDone! Final total lines: {len(lines)}')
print('Verification lines 745~768:')
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()
for i, line in enumerate(verify[744:769], start=745):
    print(f'{i}: {repr(line)}')
