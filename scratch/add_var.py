import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add isRemodeling variable after isSavingsGeneral line
old_var_section = "  const isSavingsGeneral = cat.includes('일반 저축') || cat === 'savings_general';\n\n\n  const [selectedPlan"
new_var_section = "  const isSavingsGeneral = cat.includes('일반 저축') || cat === 'savings_general';\n  const isRemodeling    = cat.includes('리모델링') || cat === 'remodeling';\n\n\n  const [selectedPlan"

if old_var_section in content:
    content = content.replace(old_var_section, new_var_section, 1)
    print('isRemodeling variable added')
else:
    print('ERROR: var section not found')
    idx = content.find("isSavingsGeneral = cat.includes")
    print(repr(content[idx:idx+200]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
