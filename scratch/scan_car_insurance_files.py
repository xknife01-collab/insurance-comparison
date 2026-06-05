import os
import re
from bs4 import BeautifulSoup

def scan_files():
    base_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    print("==================================================")
    print(" [Search Car Insurance Data in All Files] ")
    print("==================================================")
    
    keywords = ["자동차", "자차", "대물", "대인", "car", "auto", "vehicle"]
    matched_files = []
    
    for root, dirs, files in os.walk(base_dir):
        # Skip system and build dirs
        if any(p in root for p in ["node_modules", ".git", ".gemini", "dist", "build", ".next"]):
            continue
            
        for file in files:
            file_path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            
            # 1. 파일명 매칭 검사
            if any(k in file.lower() for k in keywords):
                matched_files.append((file_path, "파일명 키워드 포함"))
                continue
            
            # 2. 내용 매칭 검사
            if ext not in [".xlsx", ".xls", ".html", ".htm", ".json", ".csv", ".txt", ".xml"]:
                continue
                
            try:
                # 텍스트 파일 및 HTML 형식의 xls 파일 읽기
                if ext in [".xls", ".html", ".htm", ".txt", ".csv", ".xml"]:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        head = f.read(10000) # 첫 10,000자 스캔
                    
                    # HTML 파싱 검사
                    if "<html" in head.lower() or "<table" in head.lower():
                        soup = BeautifulSoup(head, "html.parser")
                        text = soup.get_text()
                    else:
                        text = head
                        
                    if any(k in text for k in keywords):
                        matched_files.append((file_path, "HTML/텍스트 내용 키워드 포함"))
                        
                elif ext == ".xlsx":
                    # xlsx는 zip 구조이므로 가볍게 xml 텍스트 스캔 방식으로 우회하여 빠른 체크
                    with open(file_path, "rb") as f:
                        content_bytes = f.read(15000)
                    content_str = content_bytes.decode('utf-8', errors='ignore')
                    if any(k in content_str for k in keywords):
                        matched_files.append((file_path, "XLSX 파일 내 키워드 포함"))
                        
                elif ext == ".json":
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read(5000)
                    if any(k in content for k in keywords):
                        matched_files.append((file_path, "JSON 내 키워드 포함"))
                        
            except Exception as e:
                pass
                
    print("\n--------------------------------------------------")
    if matched_files:
      print(f"Total {len(matched_files)} files found matching car insurance keywords:\n")
      for path, reason in matched_files:
        rel_path = os.path.relpath(path, base_dir)
        print(f"File: {rel_path}")
        print(f"   Reason: {reason}")
        print(f"   Path: {path}\n")
    else:
      print("Result: No car insurance-related database files were found in the workspace.")
    print("==================================================")

if __name__ == "__main__":
    scan_files()
