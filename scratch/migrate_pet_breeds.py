import psycopg2

def run_migration():
    print("[*] Connecting to Supabase via individual keyword arguments...")
    
    sql = """
    BEGIN;

    CREATE TABLE IF NOT EXISTS public.pet_breeds (
        id SERIAL PRIMARY KEY,
        pet_type VARCHAR(10) NOT NULL,
        breed_name VARCHAR(100) NOT NULL UNIQUE,
        english_name VARCHAR(100),
        risk_group VARCHAR(50) NOT NULL,
        multiplier NUMERIC(4, 2) NOT NULL,
        vulnerability VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_pet_breeds_type_name ON public.pet_breeds (pet_type, breed_name);

    ALTER TABLE public.pet_breeds ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow public read access to pet_breeds" ON public.pet_breeds;

    CREATE POLICY "Allow public read access to pet_breeds" ON public.pet_breeds FOR SELECT TO public USING (true);

    INSERT INTO public.pet_breeds (pet_type, breed_name, english_name, risk_group, multiplier, vulnerability) VALUES
    ('dog', '말티즈', 'Maltese', 'high', 1.25, '슬개골 탈구, 심장판막증, 눈물샘 폐색'),
    ('dog', '포메라니안', 'Pomeranian', 'high', 1.25, '기관지 협착증, 슬개골 탈구, 탈모증(BSD)'),
    ('dog', '치와와', 'Chihuahua', 'high', 1.25, '뇌수두증(천문열림), 슬개골 탈구, 활막염'),
    ('dog', '요크셔', 'Yorkshire Terrier', 'high', 1.25, '기관지 협착증, 저혈당증, 치석 및 치주염'),
    ('dog', '비숑 프리제', 'Bichon Frise', 'medium', 1.15, '요로 결석, 쿠싱 증후군, 만성 피부염'),
    ('dog', '토이푸들', 'Toy Poodle', 'medium', 1.15, '슬개골 탈구, 외이염(귓병), 점진적 망막 위축'),
    ('dog', '푸들', 'Poodle', 'medium', 1.15, '점진적 망막 위축, 외이염, 피부 알레르기'),
    ('dog', '시추', 'Shih Tzu', 'medium', 1.15, '안구 건조증, 각막염, 외이염, 지루성 피부염'),
    ('dog', '닥스훈트', 'Dachshund', 'medium', 1.15, '추간판 탈출증(허리 디스크), 척추 관절염'),
    ('dog', '슈나우저', 'Schnauzer', 'medium', 1.15, '췌장염, 요로 결석증, 피부 면역 질환'),
    ('dog', '스피츠', 'Spitz', 'medium', 1.15, '슬개골 탈구, 피부 탈모, 예민성 피부 질환'),
    ('dog', '웰시코기', 'Welsh Corgi', 'medium', 1.15, '퇴행성 골관절염, 척추 디스크, 비만증'),
    ('dog', '비글', 'Beagle', 'medium', 1.15, '백내장, 녹내장, 만성 외이염, 추간판 디스크'),
    ('dog', '코카스파니엘', 'Cocker Spaniel', 'medium', 1.15, '외이염, 백내장, 아토피성 만성 피부염'),
    ('dog', '이탈리안 그레이하운드', 'Italian Greyhound', 'medium', 1.15, '골절(두께가 얇음), 치석 및 치주염, 탈모증'),
    ('dog', '파피용', 'Papillon', 'normal', 1.00, '슬개골 탈구, 백내장, 점진적 망막 위축'),
    ('dog', '시바견', 'Shiba Inu', 'normal', 1.00, '치석 및 치주염, 아토피성 피부염, 백내장'),
    ('dog', '진돗개', 'Jindo', 'normal', 1.00, '알레르기성 피부염, 선천적 유전병 매우 적음'),
    ('dog', '프렌치불독', 'French Bulldog', 'super_high', 1.40, '단두종 호흡기 증후군, 척추 이상, 피부 주름염'),
    ('dog', '불독', 'Bulldog', 'super_high', 1.40, '단두종 호흡기 증후군, 고관절 형성 부전, 피부염'),
    ('dog', '리트리버', 'Golden Retriever', 'super_high', 1.40, '고관절 형성 부전, 림프종(암), 퇴행성 관절염'),
    ('dog', '래브라도 리트리버', 'Labrador Retriever', 'super_high', 1.40, '고관절 탈구, 백내장, 점진적 망막 위축, 비만'),
    ('dog', '허스키', 'Siberian Husky', 'super_high', 1.40, '각막이상증, 녹내장/백내장, 고관절 형성이상'),
    ('dog', '말라뮤트', 'Alaskan Malamute', 'super_high', 1.40, '백내장, 신장염, 고관절 형성 부전, 탈모'),
    ('dog', '믹스견', 'Mixed Breed Dog', 'normal', 1.00, '잡종 강세로 유전 질환이 매우 적으며 가장 튼튼함'),
    ('cat', '코리안 쇼트헤어', 'Korean Shorthair', 'discount', 0.95, '튼튼함, 하부 요로계 질환(결석, 방광염)'),
    ('cat', '러시안블루', 'Russian Blue', 'normal', 1.05, '당뇨병, 비만, 요로 결석'),
    ('cat', '샴', 'Siamese', 'normal', 1.05, '림프종, 만성 신부전, 사시, 유선 종양'),
    ('cat', '벵갈', 'Bengal', 'normal', 1.05, '비대성 심근증(HCM), 점진적 망막 위축, 신장 결석'),
    ('cat', '아비시니안', 'Abyssinian', 'normal', 1.05, '신장 아밀로이드증(기능 저하), 치은염, 백내장'),
    ('cat', '아메리칸 쇼트헤어', 'American Shorthair', 'normal', 1.05, '비대성 심근증(HCM), 당뇨병, 비만 및 관절염'),
    ('cat', '브리티시 쇼트헤어', 'British Shorthair', 'normal', 1.05, '비대성 심근증(HCM), 혈우병, 신장 결석'),
    ('cat', '스코티시', 'Scottish Fold', 'high', 1.15, '유전적 골연골 이형성증(관절염), 비대성 심근증(HCM)'),
    ('cat', '페르시안', 'Persian', 'high', 1.15, '다낭성 신장질환(PKD), 단두종 호흡기 장애, 각막염'),
    ('cat', '랙돌', 'Ragdoll', 'high', 1.15, '비대성 심근증(HCM), 신장 결석, 요도염'),
    ('cat', '노르웨이 숲', 'Norwegian Forest Cat', 'high', 1.15, '글리코겐 저장 질환, 망막 형성이상, 심근증'),
    ('cat', '메인쿤', 'Maine Coon', 'high', 1.15, '고관절 형성이상, 비대성 심근증(HCM), 근육위축증'),
    ('cat', '믹스묘', 'Mixed Breed Cat', 'discount', 0.95, '자연 믹스로 유전 질환이 극히 적고 전염병 면역력 우수')
    ON CONFLICT (breed_name) DO UPDATE 
    SET pet_type = EXCLUDED.pet_type,
        english_name = EXCLUDED.english_name,
        risk_group = EXCLUDED.risk_group,
        multiplier = EXCLUDED.multiplier,
        vulnerability = EXCLUDED.vulnerability;

    COMMIT;
    """
    
    try:
        conn = psycopg2.connect(
            host="aws-0-ap-southeast-1.pooler.supabase.com",
            port=5432,
            user="postgres.wfkxwztxpugakusynhpx",
            password="rlaghddlf0411*",
            database="postgres"
        )
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        conn.close()
        print("[+] SUCCESS! Table 'pet_breeds' created and 36 breeds successfully uploaded!")
    except Exception as e:
        print(f"[-] Error executing migration: {e}")

if __name__ == "__main__":
    run_migration()
