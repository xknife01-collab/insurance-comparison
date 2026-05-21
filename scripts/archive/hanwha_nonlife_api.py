# -*- coding: utf-8 -*-
import os
import time
import json
import requests
import urllib3

urllib3.disable_warnings()

class HanwhaNonLifeAPI:
    def __init__(self):
        self.base_url = "https://www.hwgeneralins.com/notice/ir/"
        self.list_url = self.base_url + "product-ing01-list.json"
        # The download actually goes through a controller that might need the session
        self.download_url = "https://www.hwgeneralins.com/notice/ir/product-ing01-detail.json" 
        
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_nonlife")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "hanwha_nonlife_full_data.json"
        
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://www.hwgeneralins.com/notice/ir/product-ing01.do",
            "X-Requested-With": "XMLHttpRequest"
        })
        self.all_data = []

    def get_categories(self):
        # Category values observed: 01 (장기), 02 (일반), 03 (자동차)
        return [
            {"name": "장기보험", "code": "01"},
            {"name": "일반보험", "code": "02"},
            {"name": "자동차보험", "code": "03"}
        ]

    def scrape_all(self):
        print("\n[한화손해보험] API 기반 스크래핑 시작\n", flush=True)
        categories = self.get_categories()
        
        for cat in categories:
            print(f"[*] 카테고리: {cat['name']} ({cat['code']})", flush=True)
            
            # Step 1: 상품 목록 가져오기
            # Payload example: goodsGrp=01&goodsName=&page=1&rows=100
            payload = {
                "isActive": "1",
                "company": "(통합)한화손해보험",
                "gdFlgnm": "01",
                "goodsGrp": cat['code'],
                "goodsName": "",
                "page": "1",
                "rows": "100" 
            }
            
            try:
                res = self.session.post(self.list_url, data=payload, verify=False)
                data = res.json()
                products = data.get("rows", [])
                print(f"  [+] {len(products)}개의 상품 발견", flush=True)
                
                for prod in products:
                    p_name = prod.get("goodsName", "Unknown")
                    p_code = prod.get("goodsCode", "")
                    print(f"      (상세조회) {p_name} [{p_code}]", flush=True)
                    
                    # Step 2: 판매기간/파일 목록 조회 (detail)
                    # Payload: goodsGrp=01&goodsCode=G00100&goodsName=...
                    detail_payload = {
                        "isActive": "1",
                        "company": "(통합)한화손해보험",
                        "gdFlgnm": "03",
                        "goodsGrp": cat['code'],
                        "goodsCode": p_code,
                        "goodsName": p_name
                    }
                    
                    try:
                        time.sleep(0.5)
                        # Hanwha often uses an 'ing' list for periods
                        # We might need to call a different 'period' JSON if it exists,
                        # but often it's returned in the detail or another call.
                        # Based on browser observation, clicking product updates the Step 3 list.
                        # The Step 3 list is often retrieved via product-ing01-step3.json
                        step3_url = self.base_url + "product-ing01-step3.json"
                        res_step3 = self.session.post(step3_url, data=detail_payload, verify=False)
                        periods = res_step3.json().get("rows", [])
                        
                        for per in periods:
                            per_name = per.get("baseDate", "Unknown")
                            print(f"          - 기간: {per_name}", flush=True)
                            
                            # Step 4: 파일 목록 조회
                            file_payload = {
                                "isActive": "1",
                                "company": "(통합)한화손해보험",
                                "gdFlgnm": "04",
                                "goodsGrp": cat['code'],
                                "goodsCode": p_code,
                                "baseDate": per_name
                            }
                            step4_url = self.base_url + "product-ing01-step4.json"
                            res_step4 = self.session.post(step4_url, data=file_payload, verify=False)
                            files = res_step4.json().get("rows", [])
                            
                            for f_item in files:
                                f_title = f_item.get("docName", "Unknown")
                                f_path = f_item.get("filePath", "")
                                if not f_path: continue
                                
                                # Hanwha download URL: /common/fileDownload.do?filePath=...&fileName=...
                                download_base = "https://www.hwgeneralins.com/common/fileDownload.do"
                                encoded_path = requests.utils.quote(f_path)
                                encoded_name = requests.utils.quote(f_title + ".pdf")
                                full_dl_url = f"{download_base}?filePath={encoded_path}&fileName={encoded_name}"
                                
                                safe_name = f"HanwhaNon_{cat['name']}_{p_name}_{per_name}_{f_title}.pdf"
                                safe_name = "".join([c for c in safe_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                                save_path = os.path.join(self.download_root, safe_name)
                                
                                if not os.path.exists(save_path):
                                    print(f"            [Download] {f_title} ...", flush=True)
                                    try:
                                        f_res = self.session.get(full_dl_url, verify=False, stream=True)
                                        if f_res.status_code == 200:
                                            with open(save_path, 'wb') as f:
                                                for chunk in f_res.iter_content(8192):
                                                    f.write(chunk)
                                            print(f"            [OK] Saved.", flush=True)
                                        else:
                                            print(f"            [Fail] HTTP {f_res.status_code}", flush=True)
                                    except Exception as ex:
                                        print(f"            [Error] {ex}", flush=True)
                                
                                self.all_data.append({
                                    "category": cat['name'], "product": p_name,
                                    "period": per_name, "file": f_title, "path": save_path
                                })
                    except Exception as e:
                        print(f"      [-] Error processing product {p_name}: {e}")
                        continue
            except Exception as e:
                print(f"  [-] Error processing category {cat['name']}: {e}")

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Hanwha Non-Life API mode finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HanwhaNonLifeAPI().scrape_all()
