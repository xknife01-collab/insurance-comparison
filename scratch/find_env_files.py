import os
for root, dirs, files in os.walk('.'):
    # skip node_modules
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if '.env' in file:
            print(os.path.join(root, file))
