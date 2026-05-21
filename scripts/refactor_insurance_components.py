import os
import shutil
import re

BASE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src"

categories = {
    'cancer': {
        'field': r"components\calculator\fields\CancerFields.tsx",
        'summary': r"components\dashboard\summaries\CancerSummary.tsx",
        'slider': r"components\sliders\CancerSlider.tsx",
        'guide': r"components\CancerDetailedGuide.tsx"
    },
    'brain': {
        'field': r"components\calculator\fields\BrainFields.tsx",
        'summary': r"components\dashboard\summaries\BrainSummary.tsx",
        'slider': r"components\sliders\BrainSlider.tsx",
        'guide': r"components\CerebrovascularDetailedGuide.tsx"
    },
    'silson': {
        'field': r"components\calculator\fields\SilsonFields.tsx",
        'summary': r"components\dashboard\summaries\SilsonSummary.tsx",
        'slider': r"components\sliders\SilsonSlider.tsx",
        'guide': r"components\SilbiDetailedGuide.tsx"
    },
    'dental': {
        'field': r"components\calculator\fields\DentalFields.tsx",
        'summary': r"components\dashboard\summaries\DentalSummary.tsx",
        'slider': r"components\sliders\DentalSlider.tsx",
        'guide': r"components\DentalDetailedGuide.tsx"
    },
    'preExisting': {
        'field': r"components\calculator\fields\PreExistingFields.tsx",
        'summary': r"components\dashboard\summaries\PreExistingSummary.tsx",
        'slider': r"components\sliders\PreExistingSlider.tsx",
        'guide': r"components\PreExistingDetailedGuide.tsx"
    },
    'caregiving': {
        'field': r"components\calculator\fields\CaregivingFields.tsx",
        'summary': r"components\dashboard\summaries\CaregivingSummary.tsx",
        'slider': r"components\sliders\CaregivingSlider.tsx",
        'guide': r"components\CaregivingDetailedGuide.tsx"
    },
    'surgery': {
        'field': r"components\calculator\fields\SurgeryHospitalFields.tsx",
        'summary': r"components\dashboard\summaries\SurgeryHospitalSummary.tsx",
        'slider': r"components\sliders\SurgerySlider.tsx",
        'guide': r"components\SurgeryDetailedGuide.tsx"
    },
    'health': {
        'field': r"components\calculator\fields\HealthFields.tsx",
        'summary': r"components\dashboard\summaries\HealthSummary.tsx",
        'slider': r"components\sliders\HealthSlider.tsx"
    },
    'heart': {
        'summary': r"components\dashboard\summaries\HeartSummary.tsx",
        'slider': r"components\sliders\HeartSlider.tsx"
    }
}

# Ensure base directory exists
os.makedirs(os.path.join(BASE_DIR, "components", "insurance"), exist_ok=True)

# 1. Move files
for cat, files in categories.items():
    cat_dir = os.path.join(BASE_DIR, "components", "insurance", cat)
    os.makedirs(cat_dir, exist_ok=True)
    
    items_to_process = list(files.items())
    for type_name, old_path in items_to_process:
        abs_old_path = os.path.join(BASE_DIR, old_path)
        if os.path.exists(abs_old_path):
            # Normalize names
            new_name = os.path.basename(old_path)
            if "SurgeryHospital" in new_name:
                new_name = new_name.replace("SurgeryHospital", "Surgery")
            if "CerebrovascularDetailedGuide" in new_name:
                new_name = "BrainDetailedGuide.tsx"
            if "SilbiDetailedGuide" in new_name:
                new_name = "SilsonDetailedGuide.tsx"
                
            abs_new_path = os.path.join(cat_dir, new_name)
            shutil.move(abs_old_path, abs_new_path)
            files[type_name + '_new'] = abs_new_path # Store new path for refactoring
            print(f"Moved {old_path} -> {abs_new_path}")

def update_file_contents(filepath, rules):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    for pattern, repl in rules:
        content = re.sub(pattern, repl, content)
        
    if orig_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated imports in {filepath}")

# 2. Refactor Dashboard Imports
dashboard_path = os.path.join(BASE_DIR, r"components\AnalysisDashboard.tsx")
dashboard_rules = [
    (r"from '\./dashboard/summaries/(\w+)'", lambda m: f"from './insurance/{m.group(1).replace('Summary', '').lower() if m.group(1).replace('Summary', '').lower() in categories else {'cerebrovascular':'brain','surgeryhospital':'surgery','preexisting':'preExisting'}.get(m.group(1).replace('Summary', '').lower(), m.group(1).replace('Summary', '').lower())}/{m.group(1).replace('SurgeryHospital', 'Surgery')}'")
]
# Hardcode the replacements for AnalysisDashboard
dashboard_rules = [
    (r"import \{ CancerSummary \} from '\./dashboard/summaries/CancerSummary';", r"import { CancerSummary } from './insurance/cancer/CancerSummary';"),
    (r"import \{ BrainSummary \} from '\./dashboard/summaries/BrainSummary';", r"import { BrainSummary } from './insurance/brain/BrainSummary';"),
    (r"import \{ HeartSummary \} from '\./dashboard/summaries/HeartSummary';", r"import { HeartSummary } from './insurance/heart/HeartSummary';"),
    (r"import \{ SilsonSummary \} from '\./dashboard/summaries/SilsonSummary';", r"import { SilsonSummary } from './insurance/silson/SilsonSummary';"),
    (r"import \{ DentalSummary \} from '\./dashboard/summaries/DentalSummary';", r"import { DentalSummary } from './insurance/dental/DentalSummary';"),
    (r"import \{ PreExistingSummary \} from '\./dashboard/summaries/PreExistingSummary';", r"import { PreExistingSummary } from './insurance/preExisting/PreExistingSummary';"),
    (r"import \{ CaregivingSummary \} from '\./dashboard/summaries/CaregivingSummary';", r"import { CaregivingSummary } from './insurance/caregiving/CaregivingSummary';"),
    (r"import \{ SurgeryHospitalSummary \} from '\./dashboard/summaries/SurgeryHospitalSummary';", r"import { SurgerySummary as SurgeryHospitalSummary } from './insurance/surgery/SurgerySummary';"),
    (r"import \{ HealthSummary \} from '\./dashboard/summaries/HealthSummary';", r"import { HealthSummary } from './insurance/health/HealthSummary';"),
]
update_file_contents(dashboard_path, dashboard_rules)

# 3. Refactor Calculator Imports
calc_path = os.path.join(BASE_DIR, r"components\InsuranceCalculator.tsx")
calc_rules = [
    (r"import \{ CancerFields \} from '\./calculator/fields/CancerFields';", r"import { CancerFields } from './insurance/cancer/CancerFields';"),
    (r"import \{ BrainFields \} from '\./calculator/fields/BrainFields';", r"import { BrainFields } from './insurance/brain/BrainFields';"),
    (r"import \{ HeartFields \} from '\./calculator/fields/HeartFields';", r"import { HeartFields } from './insurance/heart/HeartFields';"),
    (r"import \{ SilsonFields \} from '\./calculator/fields/SilsonFields';", r"import { SilsonFields } from './insurance/silson/SilsonFields';"),
    (r"import \{ DentalFields \} from '\./calculator/fields/DentalFields';", r"import { DentalFields } from './insurance/dental/DentalFields';"),
    (r"import \{ PreExistingFields \} from '\./calculator/fields/PreExistingFields';", r"import { PreExistingFields } from './insurance/preExisting/PreExistingFields';"),
    (r"import \{ CaregivingFields \} from '\./calculator/fields/CaregivingFields';", r"import { CaregivingFields } from './insurance/caregiving/CaregivingFields';"),
    (r"import \{ SurgeryHospitalFields \} from '\./calculator/fields/SurgeryHospitalFields';", r"import { SurgeryFields as SurgeryHospitalFields } from './insurance/surgery/SurgeryFields';"),
    (r"import \{ HealthFields \} from '\./calculator/fields/HealthFields';", r"import { HealthFields } from './insurance/health/HealthFields';"),
]
update_file_contents(calc_path, calc_rules)

# 4. Refactor SimulationSlider Imports
slider_path = os.path.join(BASE_DIR, r"components\SimulationSlider.tsx")
slider_rules = [
    (r"import \{ CancerSlider \} from '\./sliders/CancerSlider';", r"import { CancerSlider } from './insurance/cancer/CancerSlider';"),
    (r"import \{ BrainSlider \} from '\./sliders/BrainSlider';", r"import { BrainSlider } from './insurance/brain/BrainSlider';"),
    (r"import \{ HeartSlider \} from '\./sliders/HeartSlider';", r"import { HeartSlider } from './insurance/heart/HeartSlider';"),
    (r"import \{ SilsonSlider \} from '\./sliders/SilsonSlider';", r"import { SilsonSlider } from './insurance/silson/SilsonSlider';"),
    (r"import \{ DentalSlider \} from '\./sliders/DentalSlider';", r"import { DentalSlider } from './insurance/dental/DentalSlider';"),
    (r"import \{ PreExistingSlider \} from '\./sliders/PreExistingSlider';", r"import { PreExistingSlider } from './insurance/preExisting/PreExistingSlider';"),
    (r"import \{ CaregivingSlider \} from '\./sliders/CaregivingSlider';", r"import { CaregivingSlider } from './insurance/caregiving/CaregivingSlider';"),
    (r"import \{ SurgerySlider \} from '\./sliders/SurgerySlider';", r"import { SurgerySlider } from './insurance/surgery/SurgerySlider';"),
    (r"import \{ HealthSlider \} from '\./sliders/HealthSlider';", r"import { HealthSlider } from './insurance/health/HealthSlider';"),
]
update_file_contents(slider_path, slider_rules)

# 5. Fix internal imports inside the moved files
for cat, files in categories.items():
    if 'slider_new' in files:
        # Fix slider's import of Guide and Types
        slider_rules = [
            (r"from '\.\./\.\./types/insurance'", r"from '../../../types/insurance'"), # types path changes from ../../ to ../../../
            (r"from '\.\./CerebrovascularDetailedGuide'", r"from './BrainDetailedGuide'"),
            (r"from '\.\./SilbiDetailedGuide'", r"from './SilsonDetailedGuide'"),
            (r"from '\.\./(\w+)DetailedGuide'", r"from './\1DetailedGuide'"), # Guide is now in the same folder
            (r"<CerebrovascularDetailedGuide", r"<BrainDetailedGuide"),
            (r"<SilbiDetailedGuide", r"<SilsonDetailedGuide")
        ]
        update_file_contents(files['slider_new'], slider_rules)
    
    if 'field_new' in files:
        # Fix field's imports (icons from lucide-react mostly, no relative path changes needed except maybe common components)
        pass # fields usually only import from ../../types, which is now ../../../types
        field_rules = [
            (r"from '\.\./\.\./\.\./types", r"from '../../../types") # Actually it was components/calculator/fields/ -> ../../../types, now components/insurance/cancer/ -> ../../../types. So NO CHANGE needed!
        ]

print("Refactoring complete!")
