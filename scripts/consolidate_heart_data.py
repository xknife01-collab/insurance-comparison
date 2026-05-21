import pandas as pd
import re
import os
import warnings

warnings.filterwarnings('ignore')

# 원본 및 타겟 파일 경로
SOURCE_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_extracted_data.xlsx"
CONSOLIDATED_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\heart_final_consolidated.xlsx"

def clean_money(v):
    if pd.isna(v) or v == "": return 0
    v = str(v).replace(',', '').replace('원', '').strip()
    nums = re.findall(r'\d+', v)
    return int(nums[0]) if nums else 0

def consolidate_data():
    if not os.path.exists(SOURCE_FILE): 
        print("원본 파일을 찾을 수 없습니다.")
        return
        
    print("[*] 데이터 통합 및 정제 작업 시작...")
    df = pd.read_excel(SOURCE_FILE).astype(object)
    
    # 1. 키워드 필터링 (종신, 어린이, 쥬니어, 암)
    exclude_kws = ["종신", "어린이", "쥬니어", "암", "유니버설", "CI", "GI", "변액", "연금"]
    def is_target(name):
        name_str = str(name)
        return not any(kw in name_str for kw in exclude_kws)
    
    df = df[df.iloc[:, 1].apply(is_target)]
    print(f"  [+] 키워드 필터링 완료. (남은 행 수: {len(df)})")

    # 2. 보험료 숫자 변환
    df['m_val'] = df['남성보험료'].apply(clean_money)
    df['f_val'] = df['여성보험료'].apply(clean_money)
    
    # 3. 상품별 통합 (보험회사 + 상품명 기준)
    # 0:보험회사, 1:상품명, 2:구분
    results = []
    grouped = df.groupby([df.iloc[:, 0], df.iloc[:, 1]])
    
    for (co, prod), group in grouped:
        # 주계약이 포함되어 있는지 확인
        has_main = group.iloc[:, 2].astype(str).str.contains('주계약|기본', na=False).any()
        if not has_main: continue # 특약만 있는 상품은 제외
        
        # 데이터 통합
        m_total = group['m_val'].sum()
        f_total = group['f_val'].sum()
        
        # 모든 담보명 합치기
        all_coverages = ", ".join(group.iloc[:, 3].dropna().unique())
        
        # 상세안내 중 가장 긴 것 선택
        all_details = sorted(group.iloc[:, 13].dropna().astype(str), key=len, reverse=True)
        rep_detail = all_details[0] if all_details else ""
        
        # 첫 번째 행의 기본 정보 가져오기
        first_row = group.iloc[0]
        
        results.append({
            "보험회사": co,
            "상품명": prod,
            "남성총보험료": m_total,
            "여성총보험료": f_total,
            "주요담보리스트": all_coverages,
            "상세안내": rep_detail,
            "판매채널": first_row.get('판매채널', ''),
            "연락처": first_row.get('연락처', ''),
            "기준일자": first_row.get('기준일자', '')
        })
        
    # 결과 데이터프레임 생성 및 정렬
    final_df = pd.DataFrame(results).sort_values(by="남성총보험료", ascending=True)
    
    # 엑셀 저장
    final_df.to_excel(CONSOLIDATED_FILE, index=False)
    print(f"  [+] 통합 완료! 총 {len(final_df)}개의 유니크한 상품이 생성되었습니다.")
    print(f"  [+] 저장 위치: {CONSOLIDATED_FILE}")

    # DB 적재 스크립트 실행을 위한 준비 완료
    return final_df

if __name__ == "__main__":
    consolidate_data()
