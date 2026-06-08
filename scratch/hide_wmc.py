with open('src/components/AnalysisDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Line 996 (0-indexed: 995) = section start
# Line 1185 (0-indexed: 1184) = </section>

# Wrap lines 995~1184 with {!isRemodeling && (...)}
section_lines = lines[995:1185]

new_section = ['      {!isRemodeling && (\n'] + section_lines + ['      )}\n']

new_lines = lines[:995] + new_section + lines[1185:]

with open('src/components/AnalysisDashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done. Lines: {len(lines)} -> {len(new_lines)}')
