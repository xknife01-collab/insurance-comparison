# -*- coding: utf-8 -*-
import dns.resolver
import sys

sys.stdout.reconfigure(encoding='utf-8')

def resolve():
    for host in ["db.wfkxwztxpugakusynhpx.supabase.co", "aws-0-ap-southeast-1.pooler.supabase.com"]:
        print(f"[*] Resolving {host} via public DNS...")
        for dns_server in ["8.8.8.8", "1.1.1.1"]:
            try:
                resolver = dns.resolver.Resolver()
                resolver.nameservers = [dns_server]
                answers = resolver.resolve(host, 'A')
                ips = [ans.to_text() for ans in answers]
                print(f"  [+] DNS {dns_server} resolved to: {ips}")
                break
            except Exception as e:
                print(f"  [-] DNS {dns_server} failed: {e}")

if __name__ == '__main__':
    resolve()
