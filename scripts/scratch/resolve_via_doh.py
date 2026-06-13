# -*- coding: utf-8 -*-
import urllib.request
import json
import sys
import ssl

sys.stdout.reconfigure(encoding='utf-8')

def resolve_doh(host):
    url = f"https://cloudflare-dns.com/dns-query?name={host}&type=A"
    req = urllib.request.Request(url, headers={"Accept": "application/dns-json"})
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=context) as response:
            data = json.loads(response.read().decode())
            answers = data.get("Answer", [])
            ips = [ans.get("data") for ans in answers if ans.get("type") == 1]
            return ips
    except Exception as e:
        print(f"Error resolving {host}: {e}")
        return []

def main():
    for host in ["db.wfkxwztxpugakusynhpx.supabase.co", "aws-0-ap-southeast-1.pooler.supabase.com"]:
        ips = resolve_doh(host)
        print(f"Host: {host} -> IPs: {ips}")

if __name__ == '__main__':
    main()
