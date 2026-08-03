import os
import re

def find_all_insurers_everywhere():
    # 1. 타겟 경로 설정
    root_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    
    # 2. 모든 손해/생명 보험사 키워드 (정밀 타겟)
    target_insurers = [
        "삼성화재", "현대해상", "DB손보", "DB손해보험", "KB손보", "KB손해보험", "메리츠화재", 
        "흥국화재", "롯데손보", "롯데손해보험", "MG손보", "MG손해보험", "하나손보", "하나손해보험", 
        "농협손보", "농협손해보험", "AXA", "에이스손보", "AIG",
        "삼성생명", "한화생명", "교보생명", "신한라이프", "미래에셋생명", "흥국생명", "동양생명",
        "AIA생명", "라이나생명", "DB생명", "KB라이프", "KDB생명", "DGB생명"
    ]
    
    found_results = {} # {Insurer: [Files]}
    
    print(f"Starting deep scan in {root_path}...")
    
    # 3. 모든 하위 폴더까지 전수 조사
    for root, dirs, files in os.walk(root_path):
        for f in files:
            if f.endswith(('.xls', '.html', '.csv', '.txt')):
                file_path = os.path.join(root, f)
                try:
                    # 바이너리 모드로 읽어서 인코딩 상관없이 검색
                    with open(file_path, 'rb') as rb:
                        raw_data = rb.read()
                    
                    for insurer in target_insurers:
                        # CP949와 UTF-8 두 가지 바이트 패턴으로 검색
                        p1 = insurer.encode('cp949', errors='ignore')
                        p2 = insurer.encode('utf-8', errors='ignore')
                        
                        if p1 in raw_data or p2 in raw_data:
                            if insurer not in found_results:
                                found_results[insurer] = []
                            found_results[insurer].append(f)
                except:
                    continue

    # 4. 결과 보고서 작성
    with open("scratch/final_insurer_map.txt", "w", encoding="utf-8") as out:
        out.write("Deep Scan: Final Insurer-to-File Mapping\n")
        out.write("=" * 60 + "\n")
        
        # 발견된 보험사들
        out.write(f"[발견된 보험사 총 {len(found_results)}개]\n\n")
        for insurer in sorted(found_results.keys()):
            files_found = list(set(found_results[insurer])) # 중복 제거
            out.write(f"▶ {insurer} ({len(files_found)}개 파일에서 발견)\n")
            # 대표 파일 3개만 표시
            for sample_f in files_found[:3]:
                out.write(f"   - {sample_f}\n")
            if len(files_found) > 3:
                out.write(f"   ... 외 {len(files_found)-3}개 파일\n")
            out.write("\n")
            
        # 미발견 보험사들
        missing = [i for i in target_insurers if i not in found_results]
        if missing:
            out.write("\n[미발견 보험사]\n")
            out.write(", ".join(missing) + "\n")
        
        out.write("=" * 60 + "\n")

    print(f"Deep scan complete. Result saved to scratch/final_insurer_map.txt")

if __name__ == "__main__":
    find_all_insurers_everywhere()
