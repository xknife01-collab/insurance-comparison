with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "signUp" in line or "register" in line or "handleRegister" in line or "가입" in line:
            print(f"Line {i+1}: {line.strip()}")
