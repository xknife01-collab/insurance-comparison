import subprocess
import os

commit = "ca82d85"  # Let's try the latest commit before our current work
file_path = "src/components/insurance/remodeling/PerPolicyDashboard.tsx"

cmd = f"git show {commit}:{file_path}"
res = subprocess.run(cmd, shell=True, capture_output=True)

raw_bytes = res.stdout
print(f"Total raw bytes: {len(raw_bytes)}")

# Try UTF-8
try:
    decoded_utf8 = raw_bytes.decode("utf-8")
    repl_utf8 = decoded_utf8.count("\ufffd")
    print(f"Decoded as UTF-8: {repl_utf8} replacement characters.")
except Exception as e:
    print("UTF-8 decode failed:", e)

# Try CP949
try:
    decoded_cp949 = raw_bytes.decode("cp949")
    repl_cp949 = decoded_cp949.count("\ufffd")
    print(f"Decoded as CP949: {repl_cp949} replacement characters.")
    
    # Save the CP949 version decoded and encoded as UTF-8
    with open("scratch/clean_dashboard_cp949.tsx", "w", encoding="utf-8") as f:
        f.write(decoded_cp949)
    print("Saved clean CP949 version as UTF-8 to scratch/clean_dashboard_cp949.tsx")
except Exception as e:
    print("CP949 decode failed:", e)
