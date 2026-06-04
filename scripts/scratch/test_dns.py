# -*- coding: utf-8 -*-
import socket

def test_dns():
    domains = [
        "wfkxwztxpugakusynhpx.supabase.co",
        "aws-0-ap-southeast-1.pooler.supabase.com",
        "aws-0-ap-northeast-2.pooler.supabase.com",
        "db.wfkxwztxpugakusynhpx.supabase.co",
        "google.com"
    ]
    for d in domains:
        try:
            ip = socket.gethostbyname(d)
            print(f"[+] Resolved {d} to {ip}")
        except Exception as e:
            print(f"[-] Failed to resolve {d}: {e}")

if __name__ == "__main__":
    test_dns()
