import os

src_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src"

replacements = {
    # '완벽' 계열 순화
    "완벽하게 동일한": "안정적으로 동일한",
    "완벽하게 제로화": "최대한 최소화",
    "완벽하게": "안정적으로",
    "완벽히": "든든하게",
    "완벽한": "균형 잡힌",
    "완벽 보장형": "든든한 보장형",
    "완벽 설정": "든든하게 설정",
    "완벽 보장": "든든하게 보장",
    "완벽 케어": "든든하게 대비",
    "완벽 마스터": "상세 가이드",
    "완벽 분석": "정밀 분석",
    "완벽 선지원": "든든하게 지원",
    "완벽 보호": "든든하게 보호",
    "완벽 탑재": "상세 탑재",
    "완벽 대비": "든든하게 대비",
    "완벽합니다": "안정적입니다",
    "완벽 방어": "안정적 방어",
    "완벽 커버": "든든한 대비",
    
    # '최고' 계열 순화
    "최고 수준": "우수한 수준",
    "최고급": "프리미엄",
    "최고 한도": "최대 한도",
    "최고 한도액": "최대 한도액",
    "업계 최고": "업계 우수",
    "최고율": "최대 적용율",
    "최고입니다": "추천합니다",
    "최고존엄": "프리미엄",
    "최고의 연비": "우수한 연비",
    "최고의 대안": "합리적인 대안",
    "최고 할인": "최대 할인",
    "최고 세율": "최대 세율",
    "최고의 선택": "합리적인 선택",
    "최고 금액": "최대 금액",
    "최고 효율": "최대 효율",
    "최고 목표": "최대 목표",
}

count_files = 0
count_replacements = 0

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                modified = content
                file_replaced = False
                for target, replacement in replacements.items():
                    if target in modified:
                        modified = modified.replace(target, replacement)
                        file_replaced = True
                        count_replacements += content.count(target)
                
                if file_replaced:
                    with open(filepath, 'w', encoding='utf-8', newline='') as f:
                        f.write(modified)
                    count_files += 1
                    print(f"Sanitized file: {file}")
            except Exception as e:
                print(f"Error processing {file}: {e}")

print(f"Sanitization complete. Modified {count_files} files with {count_replacements} replacements.")
