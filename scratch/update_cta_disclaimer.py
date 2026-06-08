file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the text:
# '반드시 전문 설계사를 통한 실물 증권 회수 및 정밀 분석(증권 분석)' -> '반드시 전문 설계사를 통한 정밀 분석(보험 분석)'
old_text = "반드시 전문 설계사를 통한 실물 증권 회수 및 정밀 분석(증권 분석)"
new_text = "반드시 전문 설계사를 통한 정밀 분석(보험 분석)"

# Replace the button:
# '0.1초 만에 무료 정밀 분석 신청' -> '카카오톡으로 정밀 분석 신청하기'
old_btn = "0.1초 만에 무료 정밀 분석 신청"
new_btn = "카카오톡으로 정밀 분석 신청하기"

# Replace alert text
old_alert = "0.1초 만에 무료 정밀 증권 분석 및 1:1 상담 예약이 신청되었습니다."
new_alert = "카카오톡으로 정밀 분석 신청이 완료되었습니다."

content_new = content.replace(old_text, new_text)
content_new = content_new.replace(old_btn, new_btn)
content_new = content_new.replace(old_alert, new_alert)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: CTA text and button updated to use KakaoTalk!")
