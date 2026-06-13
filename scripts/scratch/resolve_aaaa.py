import urllib.request
import json
import ssl

def resolve_doh_aaaa(host):
    url = f"https://cloudflare-dns.com/dns-query?name={host}&type=AAAA"
    req = urllib.request.Request(url, headers={"Accept": "application/dns-json"})
    try:
        context = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=context) as response:
            data = json.loads(response.read().decode())
            answers = data.get("Answer", [])
            ips = [ans.get("data") for ans in answers if ans.get("type") == 28] # type 28 is AAAA
            return ips
    except Exception as e:
        print(f"Error resolving {host}: {e}")
        return []

def main():
    host = "db.wfkxwztxpugakusynhpx.supabase.co"
    ips = resolve_doh_aaaa(host)
    print(f"Host: {host} (AAAA) -> IPs: {ips}")

if __name__ == '__main__':
    main()
