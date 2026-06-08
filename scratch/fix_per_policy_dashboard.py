file_path = r'src/components/insurance/remodeling/PerPolicyDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state initialization to open the first card by default
target_state = "  const [open,setOpen]=useState(false);"
replacement_state = "  const [open,setOpen]=useState(index === 0);"

# 2. Update chevron container to be a premium, colorful button
target_chevron = """          {open?<ChevronUp className="w-5 h-5 text-slate-400"/>:<ChevronDown className="w-5 h-5 text-slate-400"/>}"""

replacement_chevron = """          <div className={`p-2 rounded-full transition-all flex items-center justify-center ${
            open 
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 rotate-0' 
              : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 group-hover:scale-110'
          }`}>
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>"""

content_normalized = content.replace('\r\n', '\n')
target_state_norm = target_state.replace('\r\n', '\n')
replacement_state_norm = replacement_state.replace('\r\n', '\n')
target_chevron_norm = target_chevron.replace('\r\n', '\n')
replacement_chevron_norm = replacement_chevron.replace('\r\n', '\n')

if target_state_norm not in content_normalized:
    print("Error: Target state declaration not found in PerPolicyDashboard.tsx")
    exit(1)

if target_chevron_norm not in content_normalized:
    print("Error: Target chevron icon not found in PerPolicyDashboard.tsx")
    exit(1)

content_new = content_normalized.replace(target_state_norm, replacement_state_norm).replace(target_chevron_norm, replacement_chevron_norm)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: PerPolicyDashboard first card default open and chevron design updated!")
