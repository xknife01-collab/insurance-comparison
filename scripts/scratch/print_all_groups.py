import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

out = subprocess.check_output(['python', 'scripts/scratch/calculate_all_standardized_premiums.py']).decode('utf-8')
lines = out.split('\n')

method1 = False
method2 = False

print("=== METHOD 1 ALL RESULTS ===")
for line in lines:
    if "METHOD_1_START" in line:
        method1 = True
        continue
    if "METHOD_1_END" in line:
        method1 = False
    if "METHOD_2_START" in line:
        method2 = True
        continue
    if "METHOD_2_END" in line:
        method2 = False
        
    if method1:
        print(line)
        
print("=== METHOD 2 ALL RESULTS ===")
out2 = subprocess.check_output(['python', 'scripts/scratch/calculate_all_standardized_premiums.py']).decode('utf-8')
for line in out2.split('\n'):
    if "METHOD_2_START" in line:
        method2 = True
        continue
    if "METHOD_2_END" in line:
        method2 = False
    if method2:
        print(line)
