# -*- coding: utf-8 -*-
import re

with open('hanwha_debug.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print(f"HTML size: {len(html)} bytes")

# step 관련 id/class 모두 찾기
step_matches = re.findall(r'(?:id|class)=["\']([^"\']*step[^"\']*)["\']', html, re.IGNORECASE)
unique = list(dict.fromkeys(step_matches))
print('\n=== step 관련 id/class ===')
for m in unique[:40]:
    print(' ', m)

# ul/li 구조 찾기 (상품목록)
list_classes = re.findall(r'<(?:ul|ol|dl)[^>]+class=["\']([^"\']+)["\']', html)
unique_lists = list(dict.fromkeys(list_classes))
print('\n=== 목록 태그 클래스 ===')
for l in unique_lists[:30]:
    print(' ', l)

# a 태그 클래스 (버튼/링크)
a_classes = re.findall(r'<a[^>]+class=["\']([^"\']+)["\']', html)
unique_a = list(dict.fromkeys(a_classes))
print('\n=== a 태그 클래스 ===')
for a in unique_a[:40]:
    print(' ', a)

# searchForm 내부 숨겨진 필드
form_match = re.search(r'id=["\']searchForm["\'][^>]*>(.*?)</form>', html, re.DOTALL)
if form_match:
    form_html = form_match.group(1)
    inputs = re.findall(r'<input[^>]+>', form_html)
    print('\n=== #searchForm 내부 input ===')
    for inp in inputs:
        print(' ', inp[:200])

# step01 id 주변 HTML
step01_match = re.search(r'(id=["\']step01["\'][^>]*>.*?<\/[^>]+>)', html, re.DOTALL)
if step01_match:
    print('\n=== #step01 영역 (앞 500자) ===')
    print(step01_match.group(0)[:500])

# JSON 엔드포인트 패턴
json_urls = re.findall(r'/[^"\'<>\s]+\.json[^"\'<>\s]*', html)
unique_json = list(dict.fromkeys(json_urls))
print('\n=== JSON 엔드포인트 ===')
for u in unique_json[:20]:
    print(' ', u)
