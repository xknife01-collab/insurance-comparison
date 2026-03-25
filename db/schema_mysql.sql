-- [1] 보험 상품 마스터 정보 (MariaDB/MySQL 버전)
CREATE TABLE IF NOT EXISTS insurance_products (
    id VARCHAR(36) PRIMARY KEY, -- UUID 저장용
    product_code VARCHAR(50) UNIQUE NOT NULL, 
    company_name VARCHAR(100) NOT NULL,       
    display_name VARCHAR(200),                 
    standard_code VARCHAR(50) NOT NULL,        
    category VARCHAR(50),                      
    is_renewable BOOLEAN DEFAULT FALSE,        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- [2] 보험 요율(Rate) 데이터
CREATE TABLE IF NOT EXISTS insurance_rates (
    id VARCHAR(36) PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL,
    age INTEGER NOT NULL,
    job_class INTEGER DEFAULT 1,
    rate_data JSON NOT NULL, -- MariaDB 10.2+ 버전에서 JSON 지원
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_code) REFERENCES insurance_products(product_code) ON DELETE CASCADE,
    UNIQUE KEY (product_code, gender, age, job_class) -- 중복 방지 인덱스
);
