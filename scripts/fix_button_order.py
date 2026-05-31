path = r'src/components/insurance/caregiving/CaregivingFields.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_snippet = "               { l: '보험사 직접 파견(지원형)', v: 'support' },\n               { l: '현금 일당 지급(사용형)', v: 'expense' }"
new_snippet = "               { l: '현금 일당 지급(사용형)', v: 'expense' },\n               { l: '보험사 직접 파견(지원형)', v: 'support' }"

if old_snippet in content:
    result = content.replace(old_snippet, new_snippet)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print("[+] Done!")
else:
    print("[-] Not found, trying repr:")
    idx = content.find("보험사 직접 파견")
    print(repr(content[idx-20:idx+100]))
