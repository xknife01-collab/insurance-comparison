import os
env_path = ".env.local"
if os.path.exists(env_path):
    print(".env.local exists!")
    with open(env_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for line in lines:
        if '=' in line:
            key = line.split('=')[0].strip()
            print(f"Key: {key}")
else:
    print(".env.local does NOT exist!")
