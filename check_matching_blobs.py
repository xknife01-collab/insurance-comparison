import os
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r'C:\Users\zkfnt\.gemini\antigravity\brain\c5054d31-67a5-4102-b7e9-f6fa171bad3d\scratch'

files = [
    'fast_blob_e43bf5186a.tsx',
    'fast_blob_7a3cf8d51e.tsx',
    'fast_blob_259f1dfa19.tsx',
    'fast_blob_028ae0e101.tsx'
]

for f in files:
    fpath = os.path.join(scratch_dir, f)
    if os.path.exists(fpath):
        print(f"\n==================== FILE: {f} (size: {os.path.getsize(fpath)} bytes) ====================")
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as file_obj:
            content = file_obj.read()
        
        # Check for keywords
        has_sha = 'sha256' in content
        has_maskName = 'maskName' in content
        has_delete = '.delete()' in content
        print(f"  Keywords: has_sha={has_sha}, has_maskName={has_maskName}, has_delete={has_delete}")
        
        lines = content.splitlines()
        print("  First 20 lines:")
        for idx, line in enumerate(lines[:20]):
            print(f"    {idx+1}: {line}")
    else:
        print(f"File {f} not found.")
