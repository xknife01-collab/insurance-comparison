"""
GA(법인보험대리점) 전국 지점 정보 수집 스크립트
- 카카오 로컬 API로 주요 GA 회사의 전국 지점 주소 + 전화번호 수집
- 결과를 Excel 파일로 저장 (우편 발송용)

사용법:
  1. KAKAO_REST_API_KEY 에 발급받은 카카오 REST API 키를 입력
  2. pip install requests openpyxl pandas
  3. python collect_ga_branches.py
"""

import requests
import pandas as pd
import time
import sys
import io
from datetime import datetime

# Windows 콘솔 UTF-8 강제 설정
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# ─────────────────────────────────────────────
# ✅ 여기에 카카오 REST API 키를 입력하세요
KAKAO_REST_API_KEY = "93f4735f86bdb7267050661a4cda91de"
# ─────────────────────────────────────────────

# 수집 대상 GA 회사 목록 (전국 지점 포함한 대형/중형 GA - 확장판)
GA_COMPANIES = [
    # ── 초대형 독립 GA ──────────────────────────────
    "인카금융서비스",
    "지에이코리아",
    "글로벌금융판매",
    "프라임에셋",
    "케이지에이에셋",
    "메가",

    # ── 대형 독립 GA ────────────────────────────────
    "에이플러스에셋",
    "굿리치",
    "한국보험금융",
    "엠금융서비스",
    "아너스금융서비스",
    "유퍼스트보험마케팅",
    "더블유에셋",
    "영진에셋",
    "리치앤코",
    "하이리치",
    "GA코리아",
    "에이원자산관리",
    "금융나라",

    # ── 자회사형 GA ─────────────────────────────────
    "한화생명금융서비스",
    "한화라이프랩",
    "피플라이프",
    "삼성생명금융서비스",
    "삼성화재금융서비스",
    "KB라이프생명금융서비스",
    "신한금융플러스",
    "메트라이프금융서비스",
    "교보생명금융서비스",
    "NH농협생명금융서비스",
    "흥국생명금융서비스",

    # ── 플랫폼/온라인형 GA ──────────────────────────
    "보험클리닉",
    "보맵",
    "윌링스",
    "보험비교닷컴",
    "퍼스트어슈런스",

    # ── 중형 GA ─────────────────────────────────────
    "대양금융판매",
    "세종금융그룹",
    "레이크금융",
    "씨앤에이보험",
    "스타금융서비스",
    "파인에셋",
    "한맥금융",
    "BM금융서비스",
    "대성금융판매",
    "KGA에셋",
    "두손금융서비스",
    "에이스금융서비스",
    "에임보험",
    "코리아에셋투자증권",
    "한국금융서비스",
    "미래에셋생명금융서비스",
    "동부금융에셋",
    "베스트금융서비스",
    "하나금융서비스",
    "신한금융서비스",
    "우리금융서비스",
    "IBK금융서비스",
]


# 카카오 로컬 키워드 검색 API
KAKAO_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json"

def search_kakao_places(keyword: str, page: int = 1, size: int = 15) -> dict:
    """카카오 로컬 API로 장소 검색"""
    headers = {"Authorization": f"KakaoAK {KAKAO_REST_API_KEY}"}
    params = {
        "query": keyword,
        "page": page,
        "size": size,
    }
    try:
        resp = requests.get(KAKAO_SEARCH_URL, headers=headers, params=params, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  ⚠️  API 오류 [{keyword}] p{page}: {e}")
        return {}


def collect_all_branches(company_name: str) -> list[dict]:
    """한 GA 회사의 전국 지점 모두 수집 (페이징 처리)"""
    all_places = []
    seen_ids = set()

    for page in range(1, 46):  # 카카오 API 최대 45페이지
        data = search_kakao_places(company_name, page=page)
        if not data:
            break

        meta = data.get("meta", {})
        documents = data.get("documents", [])

        if not documents:
            break

        for place in documents:
            place_id = place.get("id", "")
            if place_id in seen_ids:
                continue
            seen_ids.add(place_id)

            # 상호명이 회사명을 포함하는 곳만 수집 (노이즈 제거)
            place_name = place.get("place_name", "")
            if not any(kw in place_name for kw in company_name.split()):
                continue

            all_places.append({
                "GA회사명": company_name,
                "지점명": place_name,
                "도로명주소": place.get("road_address_name", ""),
                "지번주소": place.get("address_name", ""),
                "전화번호": place.get("phone", ""),
                "카테고리": place.get("category_name", ""),
                "위도": place.get("y", ""),
                "경도": place.get("x", ""),
                "카카오URL": place.get("place_url", ""),
            })

        # 마지막 페이지 체크
        is_end = meta.get("is_end", True)
        if is_end:
            break

        time.sleep(0.15)  # API 과부하 방지

    return all_places


def run():
    if KAKAO_REST_API_KEY == "여기에_카카오_REST_API_키_입력":
        print("❌ KAKAO_REST_API_KEY를 입력해 주세요!")
        print("   카카오 디벨로퍼스(https://developers.kakao.com)에서 앱 생성 후 REST API 키를 발급받으세요.")
        sys.exit(1)

    print("=" * 60)
    print(" GA 법인보험대리점 전국 지점 정보 수집 시작")
    print(f" 수집 대상: {len(GA_COMPANIES)}개 GA 회사")
    print("=" * 60)

    all_results = []

    for i, company in enumerate(GA_COMPANIES, 1):
        print(f"\n[{i:02d}/{len(GA_COMPANIES)}] >> {company} 지점 검색 중...")
        branches = collect_all_branches(company)
        print(f"          [완료] {len(branches)}개 지점 수집")
        all_results.extend(branches)
        time.sleep(0.3)

    print(f"\n{'='*60}")
    print(f" 총 수집 지점: {len(all_results)}개")
    print("=" * 60)

    if not all_results:
        print("[오류] 수집된 데이터가 없습니다. API 키를 확인해 주세요.")
        sys.exit(1)

    # DataFrame 생성
    df = pd.DataFrame(all_results)

    # 중복 제거 (같은 도로명주소)
    before = len(df)
    df = df.drop_duplicates(subset=["도로명주소", "지점명"])
    after = len(df)
    if before != after:
        print(f" 중복 제거: {before - after}건 제거됨 -> 최종 {after}개")

    # 전화번호 없는 항목 별도 표시
    df["우편발송가능"] = df["도로명주소"].apply(lambda x: "O" if x and len(x) > 5 else "X")

    # ─── Excel 저장 ───────────────────────────────
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    output_path = f"GA_지점목록_{timestamp}.xlsx"

    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        # 전체 목록 시트
        df.to_excel(writer, sheet_name="전체지점목록", index=False)

        # 우편 발송용 시트 (주소 있는 곳만)
        mail_df = df[df["우편발송가능"] == "O"][
            ["GA회사명", "지점명", "도로명주소", "지번주소", "전화번호"]
        ].copy()
        mail_df.to_excel(writer, sheet_name="우편발송용", index=False)

        # 회사별 요약 시트
        summary = df.groupby("GA회사명").agg(
            지점수=("지점명", "count"),
            주소있는지점=("우편발송가능", lambda x: (x == "✅").sum()),
        ).reset_index()
        summary.to_excel(writer, sheet_name="회사별요약", index=False)

        # 컬럼 너비 자동 조정
        for sheet_name in writer.sheets:
            ws = writer.sheets[sheet_name]
            for col in ws.columns:
                max_len = max((len(str(cell.value or "")) for cell in col), default=10)
                ws.column_dimensions[col[0].column_letter].width = min(max_len + 4, 60)

    print(f"\n[완료] 저장: {output_path}")
    print(f"   - 전체지점목록 시트: {len(df)}개 지점")
    print(f"   - 우편발송용 시트: {len(mail_df)}개 지점 (주소 확인된 곳)")
    print(f"\n[안내] 우편발송용 시트를 참고하여 발송 작업을 진행하세요.")
    print(f"[참고] 카카오 지도에서 제공되는 번호는 지점 대표 전화번호입니다.")
    print(f"[참고] 핸드폰 번호는 개인정보 보호법으로 공개 API에서 수집 불가합니다.")


if __name__ == "__main__":
    run()
