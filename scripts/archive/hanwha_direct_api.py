# -*- coding: utf-8 -*-
"""
한화손보 API 직접 requests로 호출
product-ing01-list.json이 어떤 파라미터로 작동하는지 확인
"""
import json
import requests
import urllib3

urllib3.disable_warnings()

BASE = "https://www.hwgeneralins.com"
API_URL = "https://www.hwgeneralins.com/notice/ir/product-ing01-list.json"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.hwgeneralins.com/notice/ir/product-ing01.do",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
}

sess = requests.Session()
sess.headers.update(headers)

# 파라미터 없이 호출
print("[*] 파라미터 없이 호출...", flush=True)
r = sess.get(API_URL, verify=False, timeout=30)
print(f"status: {r.status_code}, size: {len(r.content)}", flush=True)

if r.status_code == 200:
    # 첫 번째 데이터로 goodsCode, path 확인
    data = r.json()
    lst = data.get('list', []) if isinstance(data, dict) else data
    print(f"list 크기: {len(lst)}", flush=True)
    
    if lst and isinstance(lst[0], dict):
        print(f"키: {list(lst[0].keys())[:20]}", flush=True)
        # 현재 판매 중인 제품들 (isActive=1)
        active = [row for row in lst if row.get('isActive') == 1]
        print(f"\n현재 판매 중 {len(active)}개:", flush=True)
        for row in active:
            name = row.get('goodsName', '')
            grp = row.get('goodsGrp', '')
            path = row.get('path', '')
            f1 = row.get('file1', '')
            f2 = row.get('file2', '')
            f3 = row.get('file3', '')
            print(f"  {grp}/{name} | {path}", flush=True)
            if f1: print(f"    file1: {f1}", flush=True)
            if f2: print(f"    file2: {f2}", flush=True)
            if f3: print(f"    file3: {f3}", flush=True)
    
    # 전체 저장
    with open("hanwha_direct_api.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] hanwha_direct_api.json 저장 완료", flush=True)
else:
    print(f"실패: {r.status_code}", flush=True)
    print(r.text[:500], flush=True)

# goodsCode 파라미터 테스트
print("\n[*] goodsCode=건강 파라미터 테스트...", flush=True)
r2 = sess.get(API_URL, params={"goodsCode": "건강", "goodsGrp": "건강/질병"}, verify=False, timeout=30)
print(f"status: {r2.status_code}, size: {len(r2.content)}", flush=True)
if r2.status_code == 200:
    d2 = r2.json()
    lst2 = d2.get('list', []) if isinstance(d2, dict) else d2
    print(f"list 크기: {len(lst2)}", flush=True)
    if lst2:
        print(f"첫 항목: {json.dumps(lst2[0], ensure_ascii=False)[:300]}", flush=True)
