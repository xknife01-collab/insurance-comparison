import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

out = subprocess.check_output(['python', 'scripts/scratch/calculate_all_standardized_premiums.py']).decode('utf-8')
lines = out.split('\n')
for i, line in enumerate(lines):
    if '미래에셋생명 헤리티지 정기보험 무배당 [일반가입형/순수보장형]' in line:
        # Print this line and the next 4 lines
        for j in range(5):
            if i + j < len(lines):
                print(lines[i + j])
        print("-" * 40)
