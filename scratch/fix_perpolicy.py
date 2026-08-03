import re

path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\insurance\remodeling\PerPolicyDashboard.tsx"

with open(path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

# ────────────────────────────────────────────────────────────────
# 1) Line 19: COMPANIES 배열 + detectType 분리 (치명적 구문 오류)
# ────────────────────────────────────────────────────────────────
content = content.replace(
    "const COMPANIES = ['DB\ufffdED\ufffd\ufffd\ufffd\ufffdEB\ufffd\ufffd\ufffd','KB\ufffdED\ufffd\ufffd\ufffd\ufffdEB\ufffd\ufffd\ufffd','\ufffdED\ufffd\ufffd\ufffd\ufffdED\ufffd\ufffd\ufffd\ufffdEB\ufffd\ufffd\ufffd','\ufffdED\ufffd\ufffd\ufffd\ufffdEB\ufffd\ufffd\ufffd','\ufffdEC\ufffd\ufffd\ufffd\ufffdED\ufffd\ufffd\ufffd','\ufffdEB\ufffd\ufffd\ufffd\ufffdED\ufffd\ufffd\ufffd\ufffd'];",
    "const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];"
)

# 물음표 패턴으로 COMPANIES 줄 교체 (위 방법이 안 될 경우 대비)
lines = content.split('\n')
new_lines = []
for line in lines:
    # Line 19 패턴: COMPANIES 배열이 detectType과 합쳐진 경우
    if "const COMPANIES" in line and "detectType" in line:
        new_lines.append("const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];")
        new_lines.append("function detectType(name: string) {")
        # detectType 함수 내용은 이미 다음 줄에 있으므로 건너뜀
        continue
    # COMPANIES만 있는 줄에서 깨진 회사명 교체
    if "const COMPANIES" in line and "detectType" not in line:
        line = re.sub(r"'[^']*'", lambda m: fix_company(m.group()), line)
    new_lines.append(line)

content = '\n'.join(new_lines)

# ────────────────────────────────────────────────────────────────
# 2) typeLabel 값들 교체
# ────────────────────────────────────────────────────────────────
replacements_label = [
    # typeLabel
    ("silson: '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd',", "silson: '실손의료비',"),
    ("pre_existing: '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd',", "pre_existing: '유병자보험',"),
    ("cancer: '\ufffd\ufffd\ufffd\ufffd',", "cancer: '암보험',"),
    ("brain: '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd',", "brain: '뇌혈관보험',"),
    ("heart: '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd',", "heart: '심장질환보험',"),
    ("accident: '\ufffd\ufffd\ufffd',", "accident: '상해보험',"),
    ("nursing: '\ufffd\ufffd\ufffd/\ufffd\ufffd\ufffd\ufffd',", "nursing: '요양/시설보험',"),
    ("child: '\ufffd\ufffd\ufffd\ufffd/\ufffd\ufffd\ufffd',", "child: '어린이/태아보험',"),
    ("car: '\ufffd\ufffd\ufffd \ufffd\ufffd',", "car: '자동차 보험',"),
    ("driver: '\ufffd\ufffd\ufffd \ufffd\ufffd',", "driver: '운전자 보험',"),
    ("pet: '\ufffd \ufffd\ufffd',", "pet: '펫 보험',"),
    ("golf: '\ufffd\ufffd\ufffd / \ufffd\ufffd\ufffd\ufffd',", "golf: '골프 / 레저보험',"),
    ("annuity: '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd',", "annuity: '연금저축보험',"),
    ("variable: '\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd',", "variable: '변액보험',"),
    ("legal: '\ufffd\ufffd/\ufffd\ufffd\ufffd\ufffd',", "legal: '민사/형사보험',"),
    ("savings: '\ufffd\ufffd \ufffd\ufffd\ufffd\ufffd',", "savings: '일반 저축보험',"),
]
for old, new in replacements_label:
    content = content.replace(old, new)

# ────────────────────────────────────────────────────────────────
# 3) detectType 정규식 패턴의 깨진 한글 교체
# ────────────────────────────────────────────────────────────────
detect_fixes = [
    ("/\ufffd\ufffd\ufffd\ufffd\ufffd|\ufffd\ufffd|\ufffd\ufffd/i", "/실손의료비|실손|실비/i"),
    ("/\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd|3\\.2\\.5|3\\.3\\.5|3\\.5\\.5/i", "/유병자|간편고지|3\\.2\\.5|3\\.3\\.5|3\\.5\\.5/i"),
    ("/\ufffd\ufffd\\/\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd\ufffd/i", "/수술\\/입원|수술비입원비|수술입원/i"),
    ("/\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd|3\ufffd\ufffd\ufffd/i", "/암보험|암진단|3대질환/i"),
    ("/\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd|\ufffd\ufffd/i.test(name)) return 'child'", "/어린이|태아보험|태아/i.test(name)) return 'child'"),
    ("/\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd\ufffd/i.test(name)) return 'brain'", "/뇌혈관|뇌졸중|뇌질환/i.test(name)) return 'brain'"),
    ("/\ufffd\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd\ufffd|\ufffd\ufffd/i.test(name)) return 'heart'", "/심장질환|심혈관|심근경색|심장/i.test(name)) return 'heart'"),
    ("/\ufffd\ufffd/i.test(name)) return 'accident'", "/상해/i.test(name)) return 'accident'"),
    ("/\ufffd\ufffd\ufffd/i.test(name)) return 'car'", "/자동차/i.test(name)) return 'car'"),
    ("/\ufffd\ufffd\ufffd/i.test(name)) return 'driver'", "/운전자/i.test(name)) return 'driver'"),
    ("/\ufffd\ufffd\ufffd|\ufffd\ufffd\ufffd/i.test(name)) return 'golf'", "/골프|레저/i.test(name)) return 'golf'"),
    ("/\ufffd\ufffd\ufffd|\ufffd\ufffd|\ufffd\ufffd\ufffd/i.test(name)) return 'fire'", "/화재|침수|누수/i.test(name)) return 'fire'"),
    ("/\ufffd\ufffd/i.test(name)) return 'property'", "/재물/i.test(name)) return 'property'"),
    ("/\ufffd\ufffd|annuity/i.test(name)) return 'annuity'", "/연금|annuity/i.test(name)) return 'annuity'"),
    ("/\ufffd\ufffd\\/\ufffd\ufffd|\ufffd\ufffd|\ufffd\ufffd/i.test(name)) return 'legal'", "/민사\\/형사|법률|소송/i.test(name)) return 'legal'"),
    ("/\ufffd\ufffd|savings/i.test(name)) return 'savings'", "/저축|savings/i.test(name)) return 'savings'"),
    ("/\ufffd\ufffd/i.test(name)) return 'credit'", "/신용/i.test(name)) return 'credit'"),
]
for old, new in detect_fixes:
    content = content.replace(old, new)

# ────────────────────────────────────────────────────────────────
# 4) 레이더 차트 label 교체 (정규식 기반)
# ────────────────────────────────────────────────────────────────
radar_fixes = [
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'급여실손'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'비급여실손'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'주사실손'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'가성비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'임플란트'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'크라운'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'3대진단비'"),
    ("label:'2\ufffd\ufffd\ufffd\ufffd'", "label:'2대진단비'"),
    ("label:'\ufffd\ufffd\ufffd'", "label:'수술비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'뇌혈관진단'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'뇌졸중진단'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'뇌출혈진단'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'뇌수술비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'심장진단'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'심근경색'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'심장수술'"),
    ("label:'\ufffd\ufffd\ufffd'", "label:'스텐트'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'상해사망'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'상해수술'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'간병서비스'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'간병비사용'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'요양병원'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'간병지원'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'재가요양'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'재가급여'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'시설급여'"),
    ("label:'3\ufffd\ufffd\ufffd\ufffd'", "label:'3대진단비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'독감치료'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'대물배상'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'자차가입'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'자상가입'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'할인적용'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'형사합의'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'변호사비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'벌금한도'"),
    ("label:'\ufffd\ufffd\ufffd'", "label:'자상비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'슬개골탈구'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'피부질환'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'홀인원'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'장비손해'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'단체할인'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'대물배상'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'가재도구'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'누수특약'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'건물손해'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'인테리어'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'영업중단'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'배상책임'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'암재발'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'표적치료'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd\ufffd'", "label:'신항암비'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'암재발'"),
    ("label:'\ufffd\ufffd\ufffd\ufffd'", "label:'할인율'"),
    ("label:'\ufffd\ufffd\ufffd'", "label:'실비'"),
]
for old, new in radar_fixes:
    content = content.replace(old, new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("1단계 완료: COMPANIES/typeLabel/레이더 교체 완료")
print("남은 깨진 한글 수:", content.count('\ufffd'))
