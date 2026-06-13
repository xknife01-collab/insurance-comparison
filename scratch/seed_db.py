import requests
import json

url = "https://wfkxwztxpugakusynhpx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwNTY5NiwiZXhwIjoyMDg5OTgxNjk2fQ.1JQWf7hQPwxcgtHRHCASoxeVXwRysMIYXvnhAF5MpHg"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

agency_id = "88888888-8888-4888-a888-888888888888"
planner_id = "99999999-9999-4999-b999-999999999999"

# Clear existing rows if any
requests.delete(f"{url}/rest/v1/planners?id=eq.{planner_id}", headers=headers)
requests.delete(f"{url}/rest/v1/agencies?id=eq.{agency_id}", headers=headers)

# Insert Agency
agency = {
    "id": agency_id,
    "name": "스마트보험파트너스",
    "logo_url": "/6397187.png",
    "subscription_status": "active",
    "lead_routing_type": "direct",
    "phone": "02-1234-5678",
    "address": "서울특별시 강남구 역삼동 스마트타워 10층 (스마트보험파트너스)"
}

r = requests.post(f"{url}/rest/v1/agencies", headers=headers, json=agency)
print("Agency insert response:", r.status_code, r.text)

# Insert Planner
planner = {
    "id": planner_id,
    "agency_id": agency_id,
    "planner_code": "planner_test_1",
    "name": "홍길동",
    "phone": "010-9876-5432",
    "is_admin": False,
    "profile_image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    "greeting_title": "백전백승 홍길동 수석 설계사",
    "greeting_content": "고객님의 현재 가입 보험을 정직하게 0.1초 만에 분석하여, 불필요한 보험료를 모두 다 다이어트해 드립니다.",
    "custom_phone": "010-9876-5432",
    "custom_address": "스마트보험파트너스 강남지점 수석설계사 홍길동",
    "kakao_link": "https://open.kakao.com/o/sTEST123",
    "subscription_status": "active"
}

r = requests.post(f"{url}/rest/v1/planners", headers=headers, json=planner)
print("Planner insert response:", r.status_code, r.text)
