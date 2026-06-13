with open(".env.local", "r", encoding="utf-8") as f:
    for line in f:
        if "SUPABASE" in line:
            print(".env.local:", line.strip().split("=")[0])
            
with open(".env", "r", encoding="utf-8") as f:
    for line in f:
        if "SUPABASE" in line:
            print(".env:", line.strip().split("=")[0])
