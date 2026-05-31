# -*- coding: utf-8 -*-
import os
import json
import time
import google.generativeai as genai

class InsurancePDFParser:
    def __init__(self, api_key: str):
        self.api_key = api_key or os.environ.get("GOOGLE_API_KEY")
        genai.configure(api_key=self.api_key)
        # 리스트에서 확인된 최첨단 모델 gemini-1.5-flash 사용
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def extract_table_data(self, pdf_path):
        """
        Gemini 2.5 native PDF 분석 로직
        """
        print(f"[*] Analyzing PDF directly with Gemini 2.5-Flash: {pdf_path}")
        
        # 1. 파일 업로드
        insurance_file = genai.upload_file(path=pdf_path, display_name="Insurance Rate Table")
        
        # 파일 처리가 완료될 때까지 대기
        while insurance_file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(2)
            insurance_file = genai.get_file(insurance_file.name)

        if insurance_file.state.name == "FAILED":
            raise ValueError(f"PDF upload failed: {insurance_file.state.name}")

        print(f"\n[+] File ready for analysis.")

        # 2. 내용 추출 프롬프트
        prompt = """
        당신은 보험 요율 전문가입니다. 
        첨부된 보험사 PDF 파일에서 보험료 요율표(Rate Table) 부분을 찾아내세요.
        담보명, 나이, 성별, 직업급수, 보험료가 포함된 표를 집중적으로 분석하세요.
        다음 JSON 리스트 형식으로 정확히 10개 항목만 추출하여 출력하세요.
        형식 예시:
        [
          {
            "coverage_name": "상해위험",
            "age": 30,
            "gender": "male",
            "job_class": 1,
            "rate": 5000
          }
        ]
        반드시 순수 JSON만 답변하세요. 코드 블록 기호(```)를 사용하지 마세요.
        """

        # 3. 모델 호출
        response = self.model.generate_content([insurance_file, prompt])
        
        # 분석 후 파일 삭제
        genai.delete_file(insurance_file.name)
        
        return response.text

    def convert_to_json(self, raw_response):
        """
        AI 응답 정제
        """
        clean_text = raw_response.replace("```json", "").replace("```", "").strip()
        return clean_text

if __name__ == "__main__":
    print("Gemini 2.5-Flash PDF Parser engine initialized.")
