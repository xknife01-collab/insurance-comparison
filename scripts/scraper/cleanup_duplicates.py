import os
import hashlib
from collections import defaultdict

def get_file_hash(file_path):
    """파일의 MD5 해시값을 계산합니다."""
    hasher = hashlib.md5()
    with open(file_path, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    return hasher.hexdigest()

def cleanup_duplicates(root_dir):
    print(f"[*] Starting duplicate cleanup in: {root_dir}")
    
    hash_map = defaultdict(list)
    total_files = 0
    duplicates_found = 0
    total_size_saved = 0

    # 모든 파일을 탐색하며 해시값 저장
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            if not filename.lower().endswith('.pdf'):
                continue
                
            file_path = os.path.join(root, filename)
            total_files += 1
            
            try:
                f_hash = get_file_hash(file_path)
                hash_map[f_hash].append(file_path)
            except Exception as e:
                print(f"[-] Error hashing {filename}: {e}")

    # 중복 파일 삭제
    for f_hash, paths in hash_map.items():
        if len(paths) > 1:
            # 첫 번째 파일은 남기고 나머지는 삭제
            original = paths[0]
            for duplicate in paths[1:]:
                try:
                    size = os.path.getsize(duplicate)
                    os.remove(duplicate)
                    duplicates_found += 1
                    total_size_saved += size
                    print(f"    [-] Deleted Duplicate: {os.path.basename(duplicate)} (Identical to {os.path.basename(original)})")
                except Exception as e:
                    print(f"    [-] Error deleting {duplicate}: {e}")

    print(f"\n[DONE] Cleanup finished.")
    print(f"  - Total files scanned: {total_files}")
    print(f"  - Duplicates removed: {duplicates_found}")
    print(f"  - Space saved: {total_size_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    download_dir = os.path.join(os.getcwd(), "downloads")
    if os.path.exists(download_dir):
        cleanup_duplicates(download_dir)
    else:
        print(f"[-] Download directory not found: {download_dir}")
